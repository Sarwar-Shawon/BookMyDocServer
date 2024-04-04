/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import { createTimeSlot,updateTimeSlot , getTimeSlots } from "../controllers/timeSlotController.js";
import { getProfile } from "../controllers/doctorController.js";
import {
    getDepartments,
  } from "../controllers/departmentController.js";
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
const pharmacyRouter = express.Router();
//
pharmacyRouter
  .route("/get-profile")
  .get(auth, checkAuthRole([roles.Doctor]), getProfile);

//timetable
pharmacyRouter
  .route("/create-time-slots")
  .post(auth, checkAuthRole([roles.Doctor]), createTimeSlot);
pharmacyRouter
  .route("/update-time-slots")
  .post(auth, checkAuthRole([roles.Doctor]), updateTimeSlot);
pharmacyRouter
  .route("/get-time-slots")
  .get(auth, checkAuthRole([roles.Doctor]), getTimeSlots);
pharmacyRouter
  .route("/getAllDepartments")
  .get(auth , checkAuthRole([roles.Patient]) , getDepartments);
//
export default pharmacyRouter;
