/*
 * @copyRight by md sarwar hoshen.
 */
import Doctors from "../models/doctors.js";
import TimeSlots from "../models/TimeSlots.js";
import Appointments from "../models/appointments.js";
import Organizations from "../models/organization.js";
import Departments from "../models/departments.js";
import Patients from "../models/patients.js";
import jwt from "jsonwebtoken";
import { getToken } from "../utils/getToken.js";
import { checkDateExistInHolidays } from "./timeSlotController.js";
import moment from "moment";

import { encryptData, decryptData } from "../utils/encryptData.js";
const _days = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];
//get all doctors
const getDoctors = async (req, res) => {
  try {
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 15;
    //
    const query = {
      active: true,
    };
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    //
    if (!isNaN(lat) && !isNaN(lng)) {
      query.organization = {
        $in: await Organizations.find({
          "addr.lat_lng": {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [lat, lng],
              },
              $maxDistance:
                (req.query.range ? Number(req.query.range) : 5) * 1609.34,
            },
          },
        }).distinct("_id"),
      };
    }
    query.dept = {
      $in: await Departments.find({
        active: true,
      }).distinct("_id"),
    };
    //
    const doctors = await Doctors.find(query)
      .populate("dept", { _id: 1, name: 1 })
      .populate("organization", { _id: 1, name: 1, addr: 1 })
      .select({
        f_name: 1,
        l_name: 1,
        dept: 1,
        organization: 1,
        img: 1,
        _id: 1,
        doc_email: 1,
      })
      .skip(skip)
      .limit(limit);
    //
    console.log("doctorsdoctorsdoctorsdoctorsdoctors:", doctors);
    res.status(200).json({
      success: true,
      data: doctors,
    });
    //
  } catch (err) {
    //return err
    console.log("err", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get doctors by department
const getDoctorsByDepartment = async (req, res) => {
  try {
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 15;
    //
    const query = {
      dept: req.query.dept,
      active: true,
    };
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      query.organization = {
        $in: await Organizations.find({
          "addr.lat_lng": {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [lat, lng],
              },
              $maxDistance:
                (req.query.range ? Number(req.query.range) : 5) * 1609.34,
            },
          },
        }).distinct("_id"),
      };
    }
    const doctors = await Doctors.find(query)
      .populate("dept", { _id: 1, name: 1 })
      .populate("organization", { _id: 1, name: 1, addr: 1 })
      .select({
        f_name: 1,
        l_name: 1,
        dept: 1,
        organization: 1,
        img: 1,
        _id: 1,
        doc_email: 1,
      })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const getAvailableDoctorsByDate = async (req, res) => {
  try {
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 15;

    const searchDate = new Date(req.query.date);
    const dayName = _days[searchDate.getDay()];
    //
    const query = {
      active: true,
    };
    if (req.query.dept) {
      query.dept = req.query.dept;
    }
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    //
    if (!isNaN(lat) && !isNaN(lng)) {
      query.organization = {
        $in: await Organizations.find({
          "addr.lat_lng": {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [lat, lng],
              },
              $maxDistance:
                (req.query.range ? Number(req.query.range) : 5) * 1609.34,
            },
          },
        }).distinct("_id"),
      };
    }
    const allDoctors = await Doctors.find(query)
      .populate("dept", { _id: 1, name: 1 })
      .populate("organization", { _id: 1, name: 1, addr: 1 })
      .select({
        f_name: 1,
        l_name: 1,
        dept: 1,
        organization: 1,
        img: 1,
        _id: 1,
        doc_email: 1,
      })
      .skip(skip)
      .limit(limit);
    //
    const availableDoctors = [];
    //
    for (const doctor of allDoctors) {
      //
      const doctorTimeSlots = await TimeSlots.findOne({ doctor: doctor._id });
      if (!doctorTimeSlots) {
        continue;
      }
      const availableTimeSlots = doctorTimeSlots.timeSlots[dayName];
      if (!availableTimeSlots) {
        continue;
      }
      if (
        doctorTimeSlots?.holidays?.length > 0 &&
        checkDateExistInHolidays(doctorTimeSlots?.holidays, searchDate)
      ) {
        continue;
      }
      //
      const startDay = new Date(req.query.date);
      startDay.setUTCHours(0, 0, 0, 0);
      const endDay = new Date(req.query.date);
      endDay.setUTCHours(23, 59, 59, 999);
      // console.log("startDay",startDay)
      // console.log("endDay",endDay)
      const existingAppointments = await Appointments.find({
        doc: doctor._id,
        apt_date: {
          $gte: startDay,
          $lte: endDay,
        },
      });
      //
      if (
        !existingAppointments.length &&
        Object.entries(availableTimeSlots).length
      ) {
        availableDoctors.push(doctor);
        continue;
      }
      //
      let isAvailable = false;
      for (const [timeSlot, details] of Object.entries(availableTimeSlots)) {
        const isBooked = existingAppointments.some(
          (appointment) => appointment.timeslot === timeSlot
        );
        if (!isBooked && details.active) {
          isAvailable = true;
          break;
        }
      }
      if (isAvailable) {
        availableDoctors.push(doctor);
      }
    }
    res.status(200).json({
      success: true,
      data: availableDoctors,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const updatePatientHealthRecord = async (req, res) => {
  try {
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "user not found" });
    }
    //
    const patient = await Patients.findById(req.body.pt_id);
    console.log("patient", patient);
    patient.medical_history = req.body.medical_history;
    // patient.medical_history = encryptData(JSON.stringify(req.body.medical_history));

    patient.save();
    //
    res.status(200).json({
      success: true,
      data: patient.medical_history,
      message: "Patient record has been updated successfully",
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
export {
  //
  getDoctors,
  getDoctorsByDepartment,
  updatePatientHealthRecord,
  getAvailableDoctorsByDate,
};
