/*
 * @copyRight by md sarwar hoshen.
 */
import { check } from "express-validator";
//
const appointmentCreateValidator = [
  check("apt_date").notEmpty().withMessage("Appointment Date is required"),
  check("timeslot").notEmpty().withMessage("Timeslot is required"),
];
//
export { appointmentCreateValidator };
