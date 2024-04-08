/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import {
  createTimeSlot,
  updateTimeSlot,
  getTimeSlots,
  getTimeSlotsByDate
} from "../controllers/timeSlotController.js";
import {
  getAttachDoctors,
} from "../controllers/nurseController.js";
import {
  getProfile,
  updateProfile
} from "../controllers/profileController.js";
import { getDepartments } from "../controllers/departmentController.js";
import {
  getDoctorAppointments,
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
import {
  auth,
  checkAuthRole,
  verifyNurseForDoctor,
} from "../middleware/auth.js";
import roles from "../helpers/roles.js";
import { upload } from "../utils/uploadImage.js";
//
const nurseRouter = express.Router();
/*
 * Profile
 */
nurseRouter
  .route("/get-profile")
  .get(auth, checkAuthRole([roles.Nurse]), getProfile);
nurseRouter
  .route("/update-profile")
  .put(auth, checkAuthRole([roles.Nurse]),upload.single("img"), updateProfile);
/*
 * Get Attach Doctor
 */
nurseRouter
  .route("/get-doctors")
  .get(auth, checkAuthRole([roles.Nurse]), getAttachDoctors);
/*
 * Departments
 */
nurseRouter
  .route("/getAllDepartments")
  .get(auth, checkAuthRole([roles.Nurse]), getDepartments);

/*
 * Timetable
 */
nurseRouter
  .route("/create-time-slots")
  .post(verifyNurseForDoctor, checkAuthRole([roles.Nurse]), createTimeSlot);
  nurseRouter
  .route("/update-time-slots")
  .post(verifyNurseForDoctor, checkAuthRole([roles.Nurse]), updateTimeSlot);
  nurseRouter
  .route("/get-time-slots")
  .get(verifyNurseForDoctor, checkAuthRole([roles.Nurse]), getTimeSlots);
  nurseRouter
  .route("/get-time-slots-by-date")
  .get(verifyNurseForDoctor, checkAuthRole([roles.Nurse]), getTimeSlotsByDate);
/*
 * Appointments
 */
nurseRouter
  .route("/get-appointments")
  .get(
    verifyNurseForDoctor,
    checkAuthRole([roles.Nurse]),
    getDoctorAppointments
  );
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
  .get(
    verifyNurseForDoctor,
    checkAuthRole([roles.Nurse]),
    getAppointmentsHistory
  );

export default nurseRouter;
