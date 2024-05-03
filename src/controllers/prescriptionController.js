/*
 * @copyRight by md sarwar hoshen.
 */
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
    console.log("req.body:::", req.body);
    const doctor = req.doctor;
    const apt = await Appointments.findById(req.body.apt_id).populate("pt", {
      _id: 1,
      pt_email: 1,
      nhs: 1,
    });
    if (!apt && !doctor) {
      return res.status(422).json({ success: false, error: "No data found" });
    }
    //
    const params = {
      pt: apt?.pt._id,
      doc: doctor._id,
      apt: req.body.apt_id,
      status: "New",
      medications: req.body.medications,
      validDt: new Date(moment(req.body.validDt).format("YYYY-MM-DD")),
      createdAt: new Date(moment().format("YYYY-MM-DD h:mm:ss")),
      nshId: apt?.pt.nhs,
      repeatOption: req.body.repeatOption,
      presType: "New",
      amount : parseFloat(req.body.medications.length * 9.65).toString()
    };
    console.log("req.bodyreq.bodyreq.body:::",req.body)
    if (req.body.phr_id) params.phar = req.body.phr_id;

    console.log("params:::", params);
    //
    const prescription = new Prescriptions(params);
    await prescription.save();
    //
    mailSender({
      to: [apt?.pt?.pt_email, doctor?.doc_email],
      subject: "New Prescription",
      body: `<p>Your <strong>Doctor: </strong> ${[
        doctor?.f_name,
        doctor?.l_name,
      ].join(" ")} has created a prescription for you.</n>
          <strong> Prescription Id:</strong> ${prescription._id}</n>
          <strong> Url:</strong> ${process.env.CLIENT_APP_URL}/prescriptions</n>
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
const createRepeatPrescription = async (req, res) => {
  try {
    //
    const doctor = req.doctor;
    const pres = await Prescriptions.findById(req.body.pres_id).populate("pt", {
      _id: 1,
      pt_email: 1,
      nhs: 1,
    });
    if (!pres && !doctor) {
      return res.status(422).json({ success: false, error: "No data found" });
    }
    //
    const params = {
      pt: pres?.pt._id,
      doc: doctor._id,
      apt: pres.apt,
      phar: req.body.phr_id,
      status: "New",
      medications: req.body.medications,
      validDt: new Date(moment(req.body.validDt).format("YYYY-MM-DD")),
      createdAt: new Date(moment().format("YYYY-MM-DD h:mm:ss")),
      repeatPresDt: new Date(moment().format("YYYY-MM-DD h:mm:ss")),
      nshId: pres?.pt.nhs,
      opid: pres._id,
      repeatOption: req.body.repeatOption,
      presType: "Repeated",
    };
    console.log("params:::", params);
    //
    const prescription = new Prescriptions(params);
    await prescription.save();
    pres.repeatReq = false;
    pres.rpid = prescription._id;
    await pres.save();
    mailSender({
      to: [pres?.pt?.pt_email, doctor?.doc_email],
      subject: "Repeated Prescription",
      body: `<p>Your <strong>Doctor: </strong> ${[
        doctor?.f_name,
        doctor?.l_name,
      ].join(" ")} has created a repeat prescription for you.</n>
          <strong> Prescription Id:</strong> ${prescription._id}</n>
          <strong> Url:</strong> ${process.env.CLIENT_APP_URL}/prescriptions</n>
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
const updatePharmacyPrescription = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "user not found" });
    }
    const prescription = await Prescriptions.findById(req.body.pr_id)
      .populate({
        path: "pt",
        select: "f_name l_name pt_email",
      })
      .populate({
        path: "doc",
        select: "f_name l_name doc_email",
      })
      .populate("phar", { name: 1, phar_email: 1 });
    //
    if (!prescription) {
      return res
        .status(422)
        .json({ success: false, error: "No prescription found" });
    }
    //update
    prescription.status = req.body.status;
    prescription.payStatus = req.body.payStatus;
    prescription.paidBy = req.body.paidBy;
    prescription.updateDt = Date.now();
    //
    if (req.body.status == "Dispensed") {
      prescription.dispensedDt = Date.now();
    }
    //
    await prescription.save();
    //
    mailSender({
      to: [prescription?.pt?.pt_email, prescription?.phar?.phar_email],
      subject: "Update Prescription",
      body: `<strong> Prescription Id:</strong> ${prescription._id} has been  <strong>${prescription?.status}</strong> by <strong>Pharmacy: </strong> ${prescription?.phar.name}</n>
        </p>`,
    });
    //
    res.status(200).json({
      success: true,
      data: {_id: prescription._id , status:  prescription.status ,  payStatus: prescription.payStatus , updateDt: prescription.updateDt , paidBy: prescription.paidBy },
      message: "Prescription has updated successfully"
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
    console.log("startDay", startDay);
    console.log("endDay", endDay);
    const params = {
      doc: doctor._id,
      createdAt: {
        $gte: startDay,
        $lte: endDay,
      },
    };
    if (req.query.repeated) {
      params.repeatReq = true;
    }
    const prescriptions = await Prescriptions.find(params)
      .populate({
        path: "doc",
        select: "_id f_name l_name img organization dept pSign",
        populate: {
          path: "organization",
          model: "Organizations",
        },
        populate: [
          { path: "organization", select: { name: 1, addr: 1 } },
          { path: "dept", select: { name: 1 } },
        ],
      })
      .populate("pt", { _id: 1, f_name: 1, l_name: 1, img: 1, nhs: 1, dob: 1 })
      .populate("phar", { _id: 1, name: 1, addr: 1, phone: 1 })
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
    const patient = req.patient;
    if (!patient) {
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
    console.log("startDay", startDay);
    console.log("endDay", endDay);
    const prescriptions = await Prescriptions.find({
      pt: patient._id,
      createdAt: {
        $gte: startDay,
        $lte: endDay,
      },
    })
      .populate({
        path: "doc",
        select: "_id f_name l_name img organization dept pSign",
        populate: {
          path: "organization",
          model: "Organizations",
        },
        populate: [
          { path: "organization", select: { name: 1, addr: 1 } },
          { path: "dept", select: { name: 1 } },
        ],
      })
      .populate("pt", { _id: 1, f_name: 1, l_name: 1, img: 1, nhs: 1, dob: 1 })
      .populate("phar", { _id: 1, name: 1, addr: 1, phone: 1 , img: 1 })
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
const getPharmacyPrescriptions = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    const pharmacy = await Pharmacies.findOne({ phar_email: curUser.email });
    if (!pharmacy) {
      return res.status(422).json({ success: false, error: "No user found" });
    }

    //
    const startDay = req.query.startDay
      ? new Date(req.query.startDay)
      : new Date();
    startDay.setUTCHours(0, 0, 0, 0);
    switch (req.query.interval) {
      case "7 days":
        startDay.setDate(startDay.getDate() - 7);
        break;
      case "1 month":
        startDay.setMonth(startDay.getMonth() - 1);
        break;
      case "1 year":
        startDay.setFullYear(startDay.getFullYear() - 1);
        break;
      default:
        break;
    }
    const endDay = req.query.endDay ? new Date(req.query.endDay) : new Date();
    endDay.setUTCHours(23, 59, 59, 999);
    //
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 10;
    //
    console.log("startDay", startDay);
    console.log("endDay", endDay);
    const prescriptions = await Prescriptions.find({
      phar: pharmacy._id,
      createdAt: {
        $gte: startDay,
        $lte: endDay,
      },
    })
      .populate({
        path: "doc",
        select: "_id f_name l_name img organization dept pSign",
        populate: {
          path: "organization",
          model: "Organizations",
        },
        populate: [
          { path: "organization", select: { name: 1, addr: 1 } },
          { path: "dept", select: { name: 1 } },
        ],
      })
      .populate("pt", { _id: 1, f_name: 1, l_name: 1, img: 1, nhs: 1, dob: 1 })
      .populate("phar", { _id: 1, name: 1, addr: 1, phone: 1 })
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
const reqRepeatPrescription = async (req, res) => {
  try {
    const patient = req.patient;
    const pres = await Prescriptions.findById(req.body.pres_id)
      .populate("doc", { doc_email: 1, f_name: 1, l_name: 1 })
      .populate("pt", { _id: 1, f_name: 1, l_name: 1, img: 1, nhs: 1, dob: 1 })
      .populate("phar", { _id: 1, name: 1, addr: 1, phone: 1 , img: 1 });
    if (!pres && !patient) {
      return res.status(422).json({ success: false, error: "No data found" });
    }
    if (pres.repeatReq) {
      return res.status(422).json({
        success: false,
        error: "You have already requested for a repeat prescription.",
      });
    }
    pres.repeatReq = true;
    pres.repeatReqDt = new Date(moment().format("YYYY-MM-DD h:mm:ss"));
    //
    await pres.save();
    //send email
    // mailSender({
    //   to: [pres?.doc?.doc_email, patient.pt_email],
    //   subject: "Request for Repeat Prescription",
    //   body: `<p>A <strong>Patient: </strong> ${[
    //     patient.f_name,
    //     patient.l_name,
    //   ].join(" ")} has requested for a repeat prescription.</n>
    //       <strong>Old Prescription Id:</strong> ${pres._id}</n>
    //       <strong>Nhs Id:</strong> ${patient.nhs}</n>
    //       <strong> Url:</strong> ${process.env.CLIENT_APP_URL}/prescriptions</n>
    //     </p>`,
    // });

    // Email body for the doctor
    const doctorEmailBody = `<p>A patient, ${patient.f_name} ${patient.l_name}, has requested for a repeat prescription.</br>
                            <strong>Old Prescription Id:</strong> ${pres._id}</br>
                            <strong>Nhs Id:</strong> ${patient.nhs}</br>
                            <strong>Url:</strong> ${process.env.CLIENT_APP_URL}/prescriptions</p>`;

    // Email body for the patient
    const patientEmailBody = `<p>You have requested a repeat prescription.</br>
                            <strong>Old Prescription Id:</strong> ${pres._id}</br>
                            <strong>Nhs Id:</strong> ${patient.nhs}</br>
                            <strong>Url:</strong> ${process.env.CLIENT_APP_URL}/prescriptions</p>`;

    // Send email to the doctor
    mailSender({
      to: pres?.doc?.doc_email,
      subject: "Request for Repeat Prescription",
      body: doctorEmailBody,
    });

    // Send email to the patient
    mailSender({
      to: patient.pt_email,
      subject: "Repeat Prescription Request Confirmation",
      body: patientEmailBody,
    });
    res.status(200).json({
      success: true,
      message: "A request for prescription has created successfully.",
      data: pres,
    });
  } catch (err) {
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
//
const findPrescriptions = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "user not found" });
    }
    const pharmacy = await Pharmacies.findOne({ phar_email: curUser.email });
    if (!pharmacy) {
      return res.status(422).json({ success: false, error: "No user found" });
    }
    if (!req.query.searchText) {
      return res
        .status(422)
        .json({ success: false, error: "Please provide nhs number" });
    }

    //
    const prescriptions = await Prescriptions.find({
      phar: pharmacy._id,
      nshId: req.query.searchText,
    })
      .populate({
        path: "pt",
        select: "_id f_name l_name img nhs dob",
      })
      .populate({
        path: "doc",
        select: "_id f_name l_name img organization dept pSign",
        populate: [
          {
            path: "organization",
            model: "Organizations",
            select: { name: 1, addr: 1 },
          },
          { path: "dept", model: "Departments", select: { name: 1 } },
        ],
      })
      .populate("phar", { _id: 1, name: 1, addr: 1, phone: 1 });

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
const updatePatientPrescriptionPayment = async (req, res) => {
  try {
    console.log("req.transObj", req.transObj)
    //
    const prescription = await Prescriptions.findById(req.transObj.pres_id).populate({
      path: "pt",
      select: "f_name l_name pt_email",
    });
    console.log("prescriptions:::", prescription)
    //
    if (!prescription) {
      return res
        .status(422)
        .json({ success: false, error: "No prescription found" });
    }
    //update
    prescription.payStatus = "Paid";
    prescription.paidBy = "Card";
    prescription.updateDt = Date.now();
    prescription.transObj = {
      payment_intent: req.transObj.payment_intent,
      paid_amount: req.transObj.paid_amount,
    };
    //
    await prescription.save();
    //
    mailSender({
      to: [prescription?.pt?.pt_email],
      subject: "Prescription Payment",
      body: `<strong> Prescription Id:</strong> ${prescription._id} has been paid successfuly by <strong>Patient: </strong> ${[prescription?.pt?.f_name , prescription?.pt?.l_name].join(" ")}</n>
        </p>`,
    });
    //
    res.status(200).json({
      success: true,
      data: prescription,
      message: "Prescription has been paid successfuly."
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
export {
  //
  createPrescription,
  getDoctorPrescriptions,
  getPatientPrescriptions,
  getPharmacyPrescriptions,
  getMedicineSuggestions,
  createRepeatPrescription,
  reqRepeatPrescription,
  findPrescriptions,
  updatePharmacyPrescription,
  updatePatientPrescriptionPayment
};
