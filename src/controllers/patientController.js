/*
 * @copyRight by md sarwar hoshen.
 */
import randomstring from "randomstring";
import Patients from "../models/patients.js";
import Doctors from "../models/doctors.js";
import {
  getAllDoctors,

} from "../controllers/adminController.js";
import mailSender from "../services/mailSender.js";
//
const getProfile = async (req, res) => {
  try {
    //
    const patient = await Patients.findOne({ doc_email: req.body.id });
    //
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const createAppointment = async (req, res) => {
  try {
    //
    const patient = await Patients.findOne({ doc_email: req.body.id });
    //
    res.status(200).json({
      success: true,
      data: patient,
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
    const patient = await Patients.findOne({ doc_email: req.body.id });
    //
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const getAppointments = async (req, res) => {
  try {
    //
    const patient = await Patients.findOne({ doc_email: req.body.id });
    //
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const getPrescriptions = async (req, res) => {
  try {
    //
    const patient = await Patients.findOne({ doc_email: req.body.id });
    //
    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get all doctors
const getDoctors = async (req, res) => {
  try {
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 15;
    const doctors = await Doctors.find({
      active: true
    })
      .populate("dept", { _id: 1, name: 1 })
      .populate("organization", { _id: 1, name: 1, addr: 1 })
      .skip(skip)
      .limit(limit);
    //
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
export {
  //
  getDoctors
};
