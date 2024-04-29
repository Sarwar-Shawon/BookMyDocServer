/*
 * @copyRight by md sarwar hoshen.
 */
import Doctors from "../models/doctors.js";
import Patients from "../models/patients.js";
import Nurses from "../models/nurses.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;
import Appointments from "../models/appointments.js";
import mailSender from "../services/mailSender.js";
import { getToken } from "../utils/getToken.js";
import jwt from "jsonwebtoken";
import moment from "moment";
//
const createAppointment = async (req, res) => {
  try {
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "user not found" });
    }
    const [patient, doctor] = await Promise.all([
      Patients.findOne({ pt_email: curUser.email }),
      Doctors.findById(req.body.doc_id),
    ]);
    if (!patient && !doctor) {
      return res.status(422).json({ success: false, error: "No data found" });
    }
    const apt = await Appointments.findOne({
      pt: patient._id,
      apt_date: new Date(moment(req.body.apt_date).format("YYYY-MM-DD")),
      timeslot: req.body.timeslot
    })
    if(apt){
      return res.status(422).json({ success: false, error: "You have already booked an appointment at the same time." });
    }
    // const date1 = new Date(new Date(req.body.apt_date).setHours(0, 0, 0, 0));
    // const date2 = new Date(new Date().setHours(0, 0, 0, 0));
    // const currentTime = new Date();
    // if (date1.getTime() === date2.getTime()) {
    //   const [hours, minutes] = req.body.timeslot.split(":");
    //   const slotTime = new Date();
    //   slotTime.setHours(hours, minutes, 0);
    //   if (currentTime > slotTime) {
    //     return res
    //       .status(422)
    //       .json({
    //         success: false,
    //         error:
    //           "You can not make this appointment, cause your selected time slot is not valid ",
    //       });
    //   }
    // }
    const params = {
      pt: patient._id,
      doc: doctor._id,
      apt_date: new Date(moment(req.body.apt_date).format("YYYY-MM-DD")),
      status: "Accepted",
      createdAt: Date.now(),
      dept: req.body.dept,
      org: req.body.org,
      timeslot: req.body.timeslot,
      uniqueId: [
        req.body.timeslot,
        moment(req.body.apt_date).format("DD-MM-YYYY"),
        doctor._id,
      ].join(""),
      notes: req.body.notes
    };
    console.log("params:::", params);
    //
    const appointment = new Appointments(params);
    const saveApt = await appointment.save();
    //
    if (saveApt._id) {
      await mailSender({
        to: [patient.pt_email, doctor.doc_email],
        subject: "New Appointment",
        body: `<p>A new appointment has created on : <strong>${moment(
          params.apt_date
        ).format("DD-MM-YYYY")}</strong> at: <strong>${
          params.timeslot
        }</strong> .</n>
            Doctor:  <strong>${[doctor.f_name, doctor.l_name].join(
              " "
            )}</strong> .</n>
            Patient:  <strong>${[patient.f_name, patient.l_name].join(
              " "
            )}</strong> .</n>
            Appointment Id:  <strong>${saveApt._id}</strong></n>
          </p>`,
      });
    }
    //
    res.status(200).json({
      success: true,
      data: saveApt,
      message: "An appointment has created successfully.",
    });
  } catch (err) {
    //return err
    console.log("err:", err);
    if (err.code == "11000") {
      return res.status(500).json({
        success: false,
        status: "exists",
        error:
          "This timeslot has already taken. Please select a new time slot.",
      });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const acceptAppointment = async (req, res) => {
  try {
    //
    // const token = getToken(req.headers["authorization"]);
    // const curUser = jwt.decode(token);
    // const user = await Doctors.findOne({ doc_email: curUser.email });
    // if (!user) {
    //   return res.status(422).json({ success: false, error: "No user found" });
    // }
    const apt = await Appointments.findOne({ _id: req.body.apt_id })
      .populate("doc", { _id: 1, f_name: 1, l_name: 1, doc_email: 1 })
      .populate("pt", { _id: 1, f_name: 1, l_name: 1, pt_email: 1, dob: 1 });
    console.log("aptapt", apt);
    if (!apt) {
      return res
        .status(422)
        .json({ success: false, error: "No appointment found" });
    }
    if (apt.status.toLowerCase() == "pending") {
      apt.status = "Accepted";
    }
    //
    apt.save();
    //
    await mailSender({
      to: [apt?.pt?.pt_email, apt?.doc?.doc_email],
      subject: "Appointment Accepted",
      body: `<p>Appointment : <strong>${
        apt._id
      }</strong> is accepted, which will be held on : <strong>${moment(
        apt.apt_date
      ).format("DD-MM-YYYY")}</strong> at: <strong>${
        apt.timeslot
      }</strong> .</n>
          Doctor:  <strong>${[apt?.doc.f_name, apt?.doc.l_name].join(
            " "
          )}</strong> .</n>
          Patient:  <strong>${[apt?.pt?.f_name, apt?.pt?.l_name].join(
            " "
          )}</strong> .</n>
        </p>`,
    });
    //
    res.status(200).json({
      success: true,
      data: apt,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const cancelAppointment = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    // const user =
    //   curUser.roles.toLowerCase() == "patient"
    //     ? await Patients.findOne({ pt_email: curUser.email })
    //     : await Doctors.findOne({ doc_email: curUser.email });
    // if (!user) {
    //   return res.status(422).json({ success: false, error: "No user found" });
    // }
    const apt = await Appointments.findOne({ _id: req.body.apt_id })
      .populate("doc", { _id: 1, f_name: 1, l_name: 1, doc_email: 1 })
      .populate("pt", { _id: 1, f_name: 1, l_name: 1, pt_email: 1, dob: 1 });

    if (!apt) {
      return res
        .status(422)
        .json({ success: false, error: "No appointment found" });
    }
    //
    await apt.deleteOne();
    //
    await mailSender({
      to: [apt?.pt?.pt_email, apt?.doc?.doc_email],
      subject: "Cancel Appointment",
      body: `<p>An appointment is canceled by ${
        curUser.roles.toLowerCase() == "patient" ? "Patient" : "Doctor"
      } which was supposed to held on : <strong>${moment(apt.apt_date).format(
        "DD-MM-YYYY"
      )}</strong> at: <strong>${apt.timeslot}</strong> .</n>
          Doctor:  <strong>${[apt?.doc?.f_name, apt?.doc?.l_name].join(
            " "
          )}</strong> .</n>
          Patient:  <strong>${[apt?.pt?.f_name, apt?.pt?.l_name].join(
            " "
          )}</strong> .</n>
          Appointment Id:  <strong>${apt._id}</strong></n>
        </p>`,
    });
    //
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const updateAppointment = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    // const user =
    //   curUser.roles.toLowerCase() == "patient"
    //     ? await Patients.findOne({ pt_email: curUser.email })
    //     : await Doctors.findOne({ doc_email: curUser.email });
    // if (!user) {
    //   return res.status(422).json({ success: false, error: "No user found" });
    // }
    const apt = await Appointments.findOne({ _id: req.body.apt_id })
      .populate("dept", { _id: 1, name: 1 })
      .populate("org", { _id: 1, name: 1, addr: 1 })
      .populate("doc", { _id: 1, f_name: 1, l_name: 1, doc_email: 1, img: 1 })
      .populate("pt", {
        _id: 1,
        f_name: 1,
        l_name: 1,
        doc_email: 1,
        img: 1,
        nhs: 1, dob: 1
        
      });
    console.log("aptapt", apt);
    if (!apt) {
      return res
        .status(422)
        .json({ success: false, error: "No appointment found" });
    }
    if (req.body.apt_date)
      apt.apt_date = new Date(moment(req.body.apt_date).format("YYYY-MM-DD"));
    if (req.body.timeslot) apt.timeslot = req.body.timeslot;
    apt.uniqueId = [
      req.body.timeslot,
      moment(req.body.apt_date).format("DD-MM-YYYY"),
      apt?.doc._id,
    ].join("");
    //
    await apt.save();
    await mailSender({
      to: [apt?.pt?.pt_email, apt?.doc?.doc_email],
      subject: "Update Appointment",
      body: `<p>An appointment is updated by ${
        curUser.roles.toLowerCase() == "patient" ? "Patient" : "Doctor"
      }, <strong>updated Date : </strong>${moment(apt.apt_date).format(
        "DD-MM-YYYY"
      )} <strong>Time:</strong> ${apt.timeslot} .</n>
      <strong>Doctor: </strong> ${[apt?.doc?.f_name, apt?.doc?.l_name].join(
        " "
      )} .</n>
          <strong> Patient:</strong>  ${[apt?.pt?.f_name, apt?.pt?.l_name].join(
            " "
          )}.</n>
          <strong> Appointment Id:</strong> ${apt._id}</n>
        </p>`,
    });
    //
    res.status(200).json({
      success: true,
      data: apt,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const getDoctorAppointments = async (req, res) => {
  try {
    //
    const doctor = req.doctor;
    //
    const startDay = req.query.startDay
      ? new Date(req.query.startDay)
      : new Date();
    startDay.setUTCHours(0, 0, 0, 0);
    const endDay = req.query.endDay ? new Date(req.query.endDay) : new Date();
    endDay.setUTCHours(23, 59, 59, 999);
    //
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 10;

    const _type = req.query.status;
    const appointments = await Appointments.find({
      doc: doctor._id,
      apt_date: {
        $gte: startDay,
      },
      status: _type,
    })
      .populate("dept", { _id: 1, name: 1 })
      .populate("org", { _id: 1, name: 1, addr: 1 })
      .populate("doc", { _id: 1, f_name: 1, l_name: 1, img: 1, pSign: 1 })
      .populate("pt", { _id: 1, f_name: 1, l_name: 1, img: 1, nhs: 1 , dob: 1 , medical_history: 1})
      .skip(skip)
      .limit(limit);
    // console.log("appointmentsappointments:::", appointments);
    //
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const getAppointmentsHistory = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    // const user =
    //   curUser.roles.toLowerCase() == "patient"
    //     ? await Patients.findOne({ pt_email: curUser.email })
    //     : await Doctors.findOne({ doc_email: curUser.email });
    // if (!user) {
    //   return res.status(422).json({ success: false, error: "No user found" });
    // }
    //
    const user =
      curUser.roles.toLowerCase() == "patient"
        ? req.patient
        : curUser.roles.toLowerCase() == "doctor"
        ? req.doctor
        : curUser.roles.toLowerCase() == "nurse"
        ? req.doctor
        : null;
    if (!user) {
      return res.status(422).json({ success: false, error: "No user found" });
    }
    const startDay = req.query.startDay
      ? new Date(req.query.startDay)
      : new Date();
    startDay.setUTCHours(0, 0, 0, 0);
    const endDay = req.query.endDay ? new Date(req.query.endDay) : new Date();
    endDay.setUTCHours(23, 59, 59, 999);
    //
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 10;

    //
    const params = {
      apt_date: {
        $gte: startDay,
        $lte: endDay,
      },
    };
    if (curUser.roles.toLowerCase() == "patient") params.pt = user._id;
    if (
      curUser.roles.toLowerCase() == "doctor" ||
      curUser.roles.toLowerCase() == "nurse"
    )
      params.doc = user._id;
    // if (req.query.status) params.status = req.query.status;
    console.log("params", params)
    const appointments = await Appointments.find(params)
      .populate("dept", { _id: 1, name: 1 })
      .populate("org")
      .populate("doc")
      .populate("pt")
      .skip(skip)
      .limit(limit);
    //
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const getPatientAppointments = async (req, res) => {
  try {
    //
    // const token = getToken(req.headers["authorization"]);
    // const curUser = jwt.decode(token);
    // const patient = await Patients.findOne({ pt_email: curUser.email });
    // if (!patient) {
    //   return res.status(422).json({ success: false, error: "No user found" });
    // }
    const patient = req.patient;
    //
    const startDay = req.query.startDay
      ? new Date(req.query.startDay)
      : new Date();
    startDay.setUTCHours(0, 0, 0, 0);
    const endDay = req.query.endDay ? new Date(req.query.endDay) : new Date();
    endDay.setUTCHours(23, 59, 59, 999);
    //
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 10;
    console.log("startDaystartDaystartDaystartDay:", startDay);

    const appointments = await Appointments.find({
      pt: patient._id,
      apt_date: {
        $gte: startDay,
      },
      status: req.query.status,
    })
      .populate("dept", { _id: 1, name: 1 })
      .populate("org", { _id: 1, name: 1, addr: 1 })
      .populate("doc", { _id: 1, f_name: 1, l_name: 1, img: 1, doc_email: 1 })
      .populate("pt", { _id: 1, f_name: 1, l_name: 1, img: 1, dob: 1, nhs: 1 })
      .skip(skip)
      .limit(limit);
    // console.log("appointmentsappointments:::", appointments);
    //
    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const getSingleAppointment = async (req, res) => {
  try {
    //
    const apt = await Appointments.findOne({ _id: req.body.apt_id })
      .populate("doc")
      .populate("pt");
    if (!apt) {
      return res
        .status(422)
        .json({ success: false, error: "No appointment found" });
    }
    //
    res.status(200).json({
      success: true,
      data: apt,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
export {
  //
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  acceptAppointment,
  updateAppointment,
  cancelAppointment,
  getAppointmentsHistory,
  getSingleAppointment
};
