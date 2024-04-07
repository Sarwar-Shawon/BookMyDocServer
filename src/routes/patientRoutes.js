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
import { auth, checkAuthRole, verifyPatient } from "../middleware/auth.js";
import roles from "../helpers/roles.js";
import { upload } from "../utils/uploadImage.js";
//
const patientRouter = express.Router();
/*
 * Profile
 */
patientRouter
  .route("/get-profile")
  .get(auth, checkAuthRole([roles.Patient]), getProfile);
/*
 * Department
 */
patientRouter
  .route("/get-dept")
  .get(auth , checkAuthRole([roles.Patient]) , getDepartments);
/*
 * Get Doctors
 */
patientRouter
  .route("/get-doctors")
  .get(auth , checkAuthRole([roles.Patient]) , getDoctorsByDepartment); 
patientRouter
  .route("/get-all-doctors")
  .get(auth , checkAuthRole([roles.Patient]) , getDoctors);
/*
 * Timeslots
 */
patientRouter
  .route("/get-time-slots")
  .get(auth , checkAuthRole([roles.Patient]) , getTimeSlotsForPatient);
/*
 * Appointments
 */
patientRouter
  .route("/create-appointment")
  .post(auth , checkAuthRole([roles.Patient]) , createAppointment);
patientRouter
  .route("/get-appointments")
  .get(verifyPatient , checkAuthRole([roles.Patient]) , getPatientAppointments);
patientRouter
  .route("/cancel-appointments")
  .put(verifyPatient , checkAuthRole([roles.Patient]) , cancelAppointment);
patientRouter
  .route("/update-appointments")
  .put(verifyPatient , checkAuthRole([roles.Patient]) , updateAppointment);
//
export default patientRouter;
