/*
 * @copyRight by md sarwar hoshen.
 */
import { check } from "express-validator";
//register doctor Validator
const doctorRegisterValidator = [
  check("doc_email")
    .notEmpty()
    .withMessage("doctor email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),
  check("f_name")
    .notEmpty()
    .withMessage("first name is required"),
  check("l_name")
    .notEmpty()
    .withMessage("last name is required"),
  check("dob")
    .notEmpty()
    .withMessage("date of birth is required"),
  check("nhs_id")
    .notEmpty()
    .withMessage("doctor licence number is required"),
  check("addr")
    .notEmpty()
    .withMessage("doctor addressis required"),

];
//register nurse Validator
const nurseRegisterValidator = [
  check("nur_email")
    .notEmpty()
    .withMessage("Nurse email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),
  check("f_name")
    .notEmpty()
    .withMessage("first name is required"),
  check("l_name")
    .notEmpty()
    .withMessage("last name is required"),
  check("dob")
    .notEmpty()
    .withMessage("date of birth is required"),
  check("nhs_id")
    .notEmpty()
    .withMessage("nurse licence number is required"),

];
//
export { doctorRegisterValidator, nurseRegisterValidator};
