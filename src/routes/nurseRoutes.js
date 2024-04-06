/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import {
  createTimeSlot,
  updateTimeSlot,
  getTimeSlots,
} from "../controllers/timeSlotController.js";
import {
  getProfile,
  getAttachDoctors,
} from "../controllers/nurseController.js";
import { getDepartments } from "../controllers/departmentController.js";
import {
  getAppointmentsForNurse,
  updateAppointment,
  acceptAppointment,
  cancelAppointment,
  getAppointmentsHistory,
} from "../controllers/appointmentController.js";
//validator
import {
  doctorRegisterValidator,
  nurseRegisterValidator,
} from "../Validator/adminControllerValidator.js";
//authurization check
import { auth, checkAuthRole , verifyNurseForDoctor } from "../middleware/auth.js";
import roles from "../helpers/roles.js";
import { upload } from "../utils/uploadImage.js";
//
const nurseRouter = express.Router();
//
nurseRouter
  .route("/get-profile")
  .get(auth, checkAuthRole([roles.Nurse]), getProfile);

//timetable
nurseRouter
  .route("/get-doctors")
  .get(auth, checkAuthRole([roles.Nurse]), getAttachDoctors);
nurseRouter
  .route("/update-time-slots")
  .post(auth, checkAuthRole([roles.Nurse]), updateTimeSlot);
nurseRouter
  .route("/get-time-slots")
  .get(auth, checkAuthRole([roles.Nurse]), getTimeSlots);
nurseRouter
  .route("/getAllDepartments")
  .get(auth, checkAuthRole([roles.Nurse]), getDepartments);
//
nurseRouter
  .route("/get-appointments")
  .get(verifyNurseForDoctor, checkAuthRole([roles.Nurse]), getAppointmentsForNurse);
nurseRouter
  .route("/accept-appointments")
  .put(verifyNurseForDoctor, checkAuthRole([roles.Nurse]), acceptAppointment);
nurseRouter
  .route("/update-appointments")
  .put(verifyNurseForDoctor, checkAuthRole([roles.Nurse]), updateAppointment);
nurseRouter
  .route("/cancel-appointments")
  .put(verifyNurseForDoctor, checkAuthRole([roles.Nurse]), cancelAppointment);
nurseRouter
  .route("/get-appointments-history")
  .get(verifyNurseForDoctor, checkAuthRole([roles.Nurse]), getAppointmentsHistory);

export default nurseRouter;
