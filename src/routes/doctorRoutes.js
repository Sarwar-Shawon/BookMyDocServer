/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import { createTimeSlot,updateTimeSlot , getTimeSlots, getTimeSlotsByDate } from "../controllers/timeSlotController.js";
import { getProfile } from "../controllers/doctorController.js";
//validator
import {
  doctorRegisterValidator,
  nurseRegisterValidator,
} from "../Validator/adminControllerValidator.js";
//authurization check
import { auth, checkAuthRole, verifyDoctor } from "../middleware/auth.js";
import roles from "../helpers/roles.js";
import { upload } from "../utils/uploadImage.js";
//
import {
  getDoctorAppointments,
  updateAppointment,
  acceptAppointment,
  cancelAppointment,
  getAppointmentsHistory
} from "../controllers/appointmentController.js";
//
const doctorRouter = express.Router();
/*
 * Profile
 */
doctorRouter
  .route("/get-profile")
  .get(auth, checkAuthRole([roles.Doctor]), getProfile);

/*
 * Timetable
 */
doctorRouter
  .route("/create-time-slots")
  .post(verifyDoctor, checkAuthRole([roles.Doctor]), createTimeSlot);
doctorRouter
  .route("/update-time-slots")
  .post(verifyDoctor, checkAuthRole([roles.Doctor]), updateTimeSlot);
doctorRouter
  .route("/get-time-slots")
  .get(verifyDoctor, checkAuthRole([roles.Doctor]), getTimeSlots);
doctorRouter
  .route("/get-time-slots-by-date")
  .get(verifyDoctor, checkAuthRole([roles.Doctor]), getTimeSlotsByDate);
/*
 * Appointments
 */
doctorRouter
  .route("/get-appointments")
  .get(verifyDoctor, checkAuthRole([roles.Doctor]), getDoctorAppointments);
doctorRouter
  .route("/accept-appointments")
  .put(verifyDoctor, checkAuthRole([roles.Doctor]), acceptAppointment);
doctorRouter
  .route("/update-appointments")
  .put(verifyDoctor, checkAuthRole([roles.Doctor]), updateAppointment);
doctorRouter
  .route("/cancel-appointments")
  .put(verifyDoctor, checkAuthRole([roles.Doctor]), cancelAppointment);
doctorRouter
  .route("/get-appointments-history")
  .get(verifyDoctor, checkAuthRole([roles.Doctor]), getAppointmentsHistory);
/*
 * Prescriptions
 */


//
export default doctorRouter;
