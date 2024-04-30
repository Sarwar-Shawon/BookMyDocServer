/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import {
  getAppointmentDetails,
} from "../controllers/appointmentController.js";
import { auth,checkAuthRole } from "../middleware/auth.js";
import roles from "../helpers/roles.js";
//
const aptRouter = express.Router();
/*
 */
aptRouter
  .route("/get-appointments-details")
  .get(auth, checkAuthRole([roles.Patient, roles.Doctor, roles.Nurse]), getAppointmentDetails);
//
export default aptRouter;
