/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import {
  getDepartments,
} from "../controllers/departmentController.js";
import { getTimeSlotsForPatient } from "../controllers/timeSlotController.js";
import { getDoctors,getDoctorsByDepartment } from "../controllers/patientController.js";
import {
  createAppointment,
  getPatientAppointments,
  updateAppointment,
  cancelAppointment,
  getAppointmentsHistory,
} from "../controllers/appointmentController.js";

//authurization check
import { auth, checkAuthRole, verifyPatient } from "../middleware/auth.js";
import roles from "../helpers/roles.js";
import { upload } from "../utils/uploadImage.js";
import {
  getPatientPrescriptions,
  reqRepeatPrescription
} from "../controllers/prescriptionController.js";
//
const patientRouter = express.Router();
/*
 * Profile
 */
patientRouter
  .route("/get-profile")
  .get(auth, checkAuthRole([roles.Patient]), getProfile);
patientRouter
  .route("/update-profile")
  .put(
    auth,
    checkAuthRole([roles.Patient]),
    upload.fields([{ name: 'img', maxCount: 1 }]),
    updateProfile
  );
/*
 * Department
 */
patientRouter
  .route("/get-dept")
  .get(auth, checkAuthRole([roles.Patient]), getDepartments);
/*
 * Get Doctors
 */
patientRouter
  .route("/get-doctors")
  .get(auth, checkAuthRole([roles.Patient]), getDoctorsByDepartment);
patientRouter
  .route("/get-all-doctors")
  .get(auth, checkAuthRole([roles.Patient]), getDoctors);
/*
 * Timeslots
 */
patientRouter
  .route("/get-time-slots")
  .get(auth, checkAuthRole([roles.Patient]), getTimeSlotsForPatient);
/*
 * Appointments
 */
patientRouter
  .route("/create-appointment")
  .post(auth, checkAuthRole([roles.Patient]), createAppointment);
patientRouter
  .route("/get-appointments")
  .get(verifyPatient, checkAuthRole([roles.Patient]), getPatientAppointments);
patientRouter
  .route("/get-appointments-history")
  .get(verifyPatient, checkAuthRole([roles.Patient]), getAppointmentsHistory);
patientRouter
  .route("/cancel-appointments")
  .put(verifyPatient, checkAuthRole([roles.Patient]), cancelAppointment);
patientRouter
  .route("/update-appointments")
  .put(verifyPatient, checkAuthRole([roles.Patient]), updateAppointment);
/*
 * Prescriptions
 */
patientRouter
  .route("/get-prescriptions")
  .get(verifyPatient, checkAuthRole([roles.Patient]), getPatientPrescriptions);

patientRouter
  .route("/request-prescription")
  .post(verifyPatient, checkAuthRole([roles.Patient]), reqRepeatPrescription);
//
export default patientRouter;
