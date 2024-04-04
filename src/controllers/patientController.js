/*
 * @copyRight by md sarwar hoshen.
 */
import randomstring from "randomstring";
import Patients from "../models/patients.js";
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
    return await getAllDoctors(req,res);
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
