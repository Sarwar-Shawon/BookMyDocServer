/*
 * @copyRight by md sarwar hoshen.
 */
import Doctors from "../models/doctors.js";
import Patients from "../models/patients.js";
import Medicines from "../models/medicines.js";
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
    console.log("req.body:::", req.body)
    const doctor = req.doctor;
    const apt = await Appointments.findById(req.body.apt_id).populate("pt", { _id :1 , pt_email: 1 , nhs: 1 });
    if (!apt && !doctor) {
      return res.status(422).json({ success: false, error: "No data found" });
    }

    const params = {
      pt: apt?.pt._id,
      doc: doctor._id,
      apt: req.body.apt_id,
      phar: req.body.phr_id,
      status: "Created",
      medications: req.body.medications,
      // validDt: req.body.validDt,
      createdAt: new Date(moment().format("YYYY-MM-DD h:mm:ss")),
      nshId: apt?.pt.nhs
    };
    console.log("params:::", params);
    //
    const prescription = new Prescriptions(params);
    await prescription.save();

    mailSender({
      to: [apt?.pt?.pt_email, doctor?.doc_email],
      subject: "New Prescription",
      body: `<p>Your <strong>Doctor: </strong> ${[
        doctor?.f_name,
        doctor?.l_name,
      ].join(" ")} has created a prescription for you.</n>
          <strong> Prescription Id:</strong> ${prescription._id}</n>
          <strong> Url:</strong> ${prescription._id}</n>
        </p>`,
    });
    
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
    const doctor = req.doctor;
    if (!doctor) {
      return res.status(422).json({ success: false, error: "No data found" });
    }
    const prescription = await Prescriptions.findById(req.body.pr_id)
    console.log("prescription", prescription);
    if (!prescription) {
      return res
        .status(422)
        .json({ success: false, error: "No prescription found" });
    }
    prescription.medications = req.body.medications
    prescription.validDt = req.body.validDt
    prescription.updateDt = Date.now
    //
    await prescription.save();
    // mailSender({
    //   to: [apt?.pt?.pt_email, apt?.doc?.doc_email],
    //   subject: "Create Appointment",
    //   body: `<p>Your <strong>Doctor: </strong> ${[
    //     doctor?.f_name,
    //     doctor?.l_name,
    //   ].join(" ")} has created a prescription for you.</n>
    //       <strong> Prescription Id:</strong> ${prescription._id}</n>
    //     </p>`,
    // });
    //
    res.status(200).json({
      success: true,
      data: prescription,
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
    //
    console.log("startDay", startDay)
    console.log("endDay", endDay)
    const prescriptions = await Prescriptions.find({
      doc: doctor._id,
      createdAt: {
        $gte: startDay,
        $lte: endDay,
      },
    })
    .populate({
      path: "doc",
      select: "_id f_name l_name img organization dept",
      populate: {
        path: "organization",
        model: "Organizations"
      },
      populate: [
        { path: "organization", select: { name: 1, addr: 1 } },
        { path: "dept", select: {  name: 1 } }
      ]
    })
      .populate("pt", { _id: 1, f_name: 1, l_name: 1, img: 1, nhs: 1 , dob:1 })
      .populate("phar", { _id: 1, name: 1, addr: 1 , phone: 1})
      .skip(skip)
      .limit(limit);
    console.log("prescriptions:::", prescriptions);
    //
    res.status(200).json({
      success: true,
      data: prescriptions,
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
//
const sharePrescription = async (req, res) => {
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
//
const getMedicineSuggestions = async (req, res) => {
  try {
    //
    const medicines = await Medicines.find({
      genericName: { $regex: req.query.search_text, $options: "i" },
    });
    console.log("medicines::", medicines);
    //
    res.status(200).json({
      success: true,
      data: medicines,
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
  getMedicineSuggestions
};
