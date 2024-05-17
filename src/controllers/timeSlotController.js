/*
 * @copyRight by md sarwar hoshen.
 */
import Doctors from "../models/doctors.js";
import Patients from "../models/patients.js";
import TimeSlots from "../models/TimeSlots.js";
import Appointments from "../models/appointments.js";
import jwt from "jsonwebtoken";
import { getToken } from "../utils/getToken.js";
import moment from "moment";

//
const _days = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};
//create
const createTimeSlot = async (req, res) => {
  try {
    //
    // const token = getToken(req.headers["authorization"]);
    // //
    // const curUser = jwt.decode(token);
    // const doctor = await Doctors.findOne({ doc_email: curUser.email });
    // if (!doctor) {
    //   return res.status(422).json({ success: false, error: "No doctor found" });
    // }
    const doctor = req.doctor;

    const timeSlots = new TimeSlots({
      timeSlots: req.body.timeSlots,
      doctor: doctor._id,
      messege: "You've successfully created timeslots.",
    });
    //
    await timeSlots.save();

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//update
const updateTimeSlot = async (req, res) => {
  try {
    //
    // const token = getToken(req.headers["authorization"]);
    // //
    // const curUser = jwt.decode(token);
    // const doctor = await Doctors.findOne({ doc_email: curUser.email });
    // if (!doctor) {
    //   return res.status(422).json({ success: false, error: "No doctor found" });
    // }
    const doctor = req.doctor;

    const doctorSlots = await TimeSlots.findOne({
      doctor: doctor._id,
    });
    //
    doctorSlots.timeSlots = req.body.timeSlots;
    //
    await doctorSlots.save();
    //
    res.status(200).json({
      success: true,
      message: "You've successfully updated timeslots.",
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get doctor time slots
const getTimeSlots = async (req, res) => {
  try {
    //
    // const token = getToken(req.headers["authorization"]);
    // const curUser = jwt.decode(token);
    // const doctor = await Doctors.findOne({ doc_email: curUser.email });
    // if (!doctor) {
    //   return res.status(422).json({ success: false, error: "No doctor found" });
    // }
    const doctor = req.doctor;
    //console.log("req.query.date::", req.query.date);
    const date = new Date(req.query.date);
    //
    const data = await TimeSlots.findOne({ doctor: doctor._id });
    //console.log("data", data);
    //
    res.status(200).json({
      success: true,
      data: data?.timeSlots || {},
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get time slots for patient
const getTimeSlotsForPatient = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    const [patient, doctor] = await Promise.all([
      Patients.findOne({ pt_email: curUser.email }),
      Doctors.findOne({ doc_email: req.query.doc_email }),
    ]);
    if (!patient && !doctor) {
      return res.status(422).json({ success: false, error: "No data found" });
    }

    //
    const date = new Date(req.query.date);
    const startOfDay = new Date(req.query.startDay || date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(req.query.endDay || date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    //
    const day = _days[startOfDay.getDay()];
    // //console.log("aaaaaa:", moment(startOfDay).format("DD-MM-YYYY"));
    //
    const data = await TimeSlots.findOne({ doctor: doctor._id });
    //check doctor availability
    //console.log("data?.holidays", data);
    if (
      data?.holidays?.length > 0 &&
      checkDateExistInHolidays(data?.holidays, date)
    ) {
      //console.log("doctor in holiday");
      return res.status(200).json({
        success: true,
        data: {},
      });
    }
    //check with existing appointments
    const timeSlotsAvailabilityData = await Appointments.find({
      doc: doctor._id,
      apt_date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    //
    if (timeSlotsAvailabilityData.length) {
      timeSlotsAvailabilityData.map((item) => {
        if (data.timeSlots[day] && data.timeSlots[day][item.timeslot]) {
          data.timeSlots[day][item.timeslot].active = false;
        }
      });
    }
    //
    let timeSlotsData = data?.timeSlots[day];
    //
    const currentTime = new Date();
    const date1 = moment(new Date(req.query.date.replace(/GMT.*$/, ""))).format(
      "DD/MM/YYYY"
    );
    const date2 = moment(new Date()).format("DD/MM/YYYY");
    if (date1 === date2) {
      const futureTimeSlots = {};
      Object.keys(timeSlotsData).forEach((key) => {
        const slot = timeSlotsData[key];
        const [hours, minutes] = slot.startTime.split(":");
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0);
        if (slotTime > currentTime) {
          futureTimeSlots[key] = slot;
        }
      });
      timeSlotsData = futureTimeSlots;
    }
    //
    res.status(200).json({
      success: true,
      data: timeSlotsData || {},
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get time slots for doctors
const getTimeSlotsByDate = async (req, res) => {
  try {
    //
    // const token = getToken(req.headers["authorization"]);
    // const curUser = jwt.decode(token);
    // const doctor = await Doctors.findOne({ doc_email: curUser.email });
    // if (!doctor) {
    //   return res.status(422).json({ success: false, error: "No doctor found" });
    // }
    const doctor = req.doctor;

    //console.log("req.query.date::", req.query.date);
    const date = new Date(req.query.date.replace(/GMT.*$/, ""));
    //console.log("req.query.date::", date);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const day = _days[startOfDay.getDay()];
    //console.log("startOfDay:::", startOfDay);
    //console.log("endOfDay:::", endOfDay);
    //console.log("day:::", day);
    
    //
    const data = await TimeSlots.findOne({ doctor: doctor._id });
    //
    if (
      data?.holidays?.length > 0 &&
      checkDateExistInHolidays(data?.holidays, date)
    ) {
      //console.log("doctor in holiday");
      return res.status(200).json({
        success: true,
        data: {},
      });
    }
    //
    const timeSlotsAvailabilityData = await Appointments.find({
      doc: doctor._id,
      apt_date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .populate("doc")
      .populate("pt")
      .populate("dept", { _id: 1, name: 1 })
      .populate("org", { _id: 1, name: 1, addr: 1 });
    //
    //console.log("timeSlotsAvailabilityData", timeSlotsAvailabilityData);
    //
    if (timeSlotsAvailabilityData) {
      timeSlotsAvailabilityData.map((item) => {
        if (data.timeSlots[day] && data.timeSlots[day][item.timeslot]) {
          data.timeSlots[day][item.timeslot].active = false;
          data.timeSlots[day][item.timeslot].aptId = item._id;
          data.timeSlots[day][item.timeslot].apt = item;
        }
      });
    }
    

    let timeSlotsData = data?.timeSlots[day];
    //
    if (req.query.skip_con) {
      return res.status(200).json({
        success: true,
        data: { [day]: timeSlotsData } || {},
      });
    }
    const currentTime = new Date();
    const date1 = moment(new Date(req.query.date.replace(/GMT.*$/, ""))).format(
      "DD/MM/YYYY"
    );
    const date2 = moment(new Date()).format("DD/MM/YYYY");
    if (date1 === date2) {
      const futureTimeSlots = {};
      Object.keys(timeSlotsData).forEach((key) => {
        const slot = timeSlotsData[key];
        const [hours, minutes] = slot.startTime.split(":");
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0);
        if (slotTime > currentTime) {
          futureTimeSlots[key] = slot;
        }
      });
      timeSlotsData = futureTimeSlots;
    }
    //
    res.status(200).json({
      success: true,
      data: timeSlotsData || {},
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//getHolidays
const getHolidays = async (req, res) => {
  try {
    const doctor = req.doctor;
    const data = await TimeSlots.findOne({ doctor: doctor._id });
    //console.log("data", data);
    //
    res.status(200).json({
      success: true,
      data: data?.holidays || [],
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//updateHolidays
const updateHolidays = async (req, res) => {
  try {
    const doctor = req.doctor;
    const timeslot = await TimeSlots.findOne({ doctor: doctor._id });
    //
    if (!timeslot) {
      return res.status(500).json({ success: false, error: "no data found" });
    }
    //console.log("req.body.holidays", req.body.holidays);
    timeslot.holidays = req.body.holidays;
    await timeslot.save();
    //
    res.status(200).json({
      success: true,
      data: timeslot?.holidays || [],
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//checkDateExistInHolidays
const checkDateExistInHolidays = (dateRanges, dt) => {
  const dateToCheckMoment = moment(dt, "DD-MM-YYYY");
  // console.log("dateToCheckMoment::", dateToCheckMoment);
  for (const range of dateRanges) {
    const startDate = moment(range.start_date, "DD-MM-YYYY");
    const endDate = moment(range.end_date, "DD-MM-YYYY");
    endDate.set({ hour: 23, minute: 59, second: 0, millisecond: 0 });

    // console.log("startDate::", startDate);
    // console.log("endDate::", endDate);

    if (dateToCheckMoment.isBetween(startDate, endDate, null, "[]")) {
      return true;
    }
  }
  return false;
};

//
export {
  createTimeSlot,
  updateTimeSlot,
  getTimeSlots,
  getTimeSlotsForPatient,
  getTimeSlotsByDate,
  getHolidays,
  updateHolidays,
  checkDateExistInHolidays
};
