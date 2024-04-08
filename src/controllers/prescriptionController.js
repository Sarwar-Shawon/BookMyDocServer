/*
 * @copyRight by md sarwar hoshen.
 */
import Doctors from "../models/doctors.js";
import Patients from "../models/patients.js";
import Appointments from "../models/appointments.js";
import Pharmacies from "../models/pharmacies.js";
import Prescriptions from "../models/prescriptions.js";
import mailSender from "../services/mailSender.js";
import { getToken } from "../utils/getToken.js";
import jwt from "jsonwebtoken";
import moment from "moment";
//
const createPrescription = async (req, res) => {
  try {
    //
    const [patient, doctor] = await Promise.all([
      Patients.findOne({ pt_email: curUser.email }),
      Doctors.findById(req.body.doc_id),
    ]);
    if (!patient && !doctor) {
      return res.status(422).json({ success: false, error: "No data found" });
    }
    const params = {
      pt_id: patient._id,
      doc_id: doctor._id,
      apt_id: apt_id,
      status: "Created",
      reasons: [],
      medications: [],
      tests: [],
      investigations: [],
    };
    console.log("params:::", params);
    //
    const prescription = new Prescriptions(params);
          await prescription.save();
    //
    // if (saveApt._id) {
    //   await mailSender({
    //     to: [patient.pt_email, doctor.doc_email],
    //     subject: "New Appointment",
    //     body: `<p>A new appointment has created on : <strong>${moment(
    //       params.apt_date
    //     ).format("DD-MM-YYYY")}</strong> at: <strong>${
    //       params.timeslot
    //     }</strong> .</n>
    //         Doctor:  <strong>${[doctor.f_name, doctor.l_name].join(
    //           " "
    //         )}</strong> .</n>
    //         Patient:  <strong>${[patient.f_name, patient.l_name].join(
    //           " "
    //         )}</strong> .</n>
    //         Appointment Id:  <strong>${saveApt._id}</strong></n>
    //       </p>`,
    //   });
    // }
    //
    res.status(200).json({
      success: true,
      data: prescription,
      message: "A prescription has created successfully.",
    });
  } catch (err) {
    //return err
    console.log("err:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const updatePrescription = async (req, res) => {
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
        nhs: 1,
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
const getDoctorPrescriptions = async (req, res) => {
  try {
    //
    const doctor = req.doctor;
    if (!doctor) {
      return res.status(422).json({ success: false, error: "No user found" });
    }
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
      .populate("doc", { _id: 1, f_name: 1, l_name: 1, img: 1 })
      .populate("pt", { _id: 1, f_name: 1, l_name: 1, img: 1, nhs: 1 })
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
const getPatientPrescriptions = async (req, res) => {
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
      .populate("pt", { _id: 1, f_name: 1, l_name: 1, img: 1 })
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
const getPharmacyPrescriptions = async (req, res) => {
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
      .populate("pt", { _id: 1, f_name: 1, l_name: 1, img: 1 })
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

export {
  //
  createPrescription,
  updatePrescription,
  getDoctorPrescriptions,
  getPatientPrescriptions,
  getPharmacyPrescriptions,
};
