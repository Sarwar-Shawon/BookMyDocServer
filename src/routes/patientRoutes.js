/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import { getProfile } from "../controllers/doctorController.js";
//
import {
    getDepartments,
    getDoctorsByDepartment
  } from "../controllers/departmentController.js";
//
import {
    getTimeSlotsForPatient,
  } from "../controllers/timeSlotController.js";
//
import {
    getDoctors,
  } from "../controllers/patientController.js";
//
import {
    createAppointment,
    getPatientAppointments,
    updateAppointment,
    cancelAppointment
  } from "../controllers/appointmentController.js";
//validator
import {
  doctorRegisterValidator,
  nurseRegisterValidator,
} from "../Validator/adminControllerValidator.js";
//authurization check
import { auth, checkAuthRole } from "../middleware/auth.js";
import roles from "../helpers/roles.js";
import { upload } from "../utils/uploadImage.js";
//
const patientRouter = express.Router();
//
patientRouter
  .route("/get-profile")
  .get(auth, checkAuthRole([roles.Patient]), getProfile);
//
patientRouter
  .route("/get-dept")
  .get(auth , checkAuthRole([roles.Patient]) , getDepartments);
//
patientRouter
  .route("/get-doctors")
  .get(auth , checkAuthRole([roles.Patient]) , getDoctorsByDepartment);
//
patientRouter
  .route("/get-all-doctors")
  .get(auth , checkAuthRole([roles.Patient]) , getDoctors);
//
patientRouter
  .route("/get-time-slots")
  .get(auth , checkAuthRole([roles.Patient]) , getTimeSlotsForPatient);
//
patientRouter
  .route("/create-appointment")
  .post(auth , checkAuthRole([roles.Patient]) , createAppointment);
patientRouter
  .route("/get-appointments")
  .get(auth , checkAuthRole([roles.Patient]) , getPatientAppointments);
patientRouter
  .route("/cancel-appointments")
  .put(auth , checkAuthRole([roles.Patient]) , cancelAppointment);
patientRouter
  .route("/update-appointments")
  .put(auth , checkAuthRole([roles.Patient]) , updateAppointment);
//
export default patientRouter;
