/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import { createTimeSlot,updateTimeSlot , getTimeSlots } from "../controllers/timeSlotController.js";
import { getProfile } from "../controllers/doctorController.js";
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
import {
  getDoctorAppointments,
  updateAppointment
} from "../controllers/appointmentController.js";
//
const doctorRouter = express.Router();
//
doctorRouter
  .route("/get-profile")
  .get(auth, checkAuthRole([roles.Doctor]), getProfile);

//timetable
doctorRouter
  .route("/create-time-slots")
  .post(auth, checkAuthRole([roles.Doctor]), createTimeSlot);
doctorRouter
  .route("/update-time-slots")
  .post(auth, checkAuthRole([roles.Doctor]), updateTimeSlot);
doctorRouter
  .route("/get-time-slots")
  .get(auth, checkAuthRole([roles.Doctor]), getTimeSlots);
doctorRouter
  .route("/get-appointments")
  .get(auth, checkAuthRole([roles.Doctor]), getDoctorAppointments);
doctorRouter
  .route("/update-appointments")
  .put(auth, checkAuthRole([roles.Doctor]), updateAppointment);
//
export default doctorRouter;
