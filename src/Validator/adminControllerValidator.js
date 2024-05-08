/*
 * @copyRight by md sarwar hoshen.
 */
import { check } from "express-validator";
//register doctor Validator
const doctorRegisterValidator = [
  check("doc_email")
    .notEmpty()
    .withMessage("Doctor email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),
  check("f_name")
    .notEmpty()
    .withMessage("First name is required"),
  check("l_name")
    .notEmpty()
    .withMessage("Last name is required")

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
    .withMessage("First name is required"),
  check("l_name")
    .notEmpty()
    .withMessage("Last name is required")
];
//register pharmacy Validator
const pharmacyRegisterValidator = [
  check("phar_email")
    .notEmpty()
    .withMessage("Pharmacy email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),
  check("name")
    .notEmpty()
    .withMessage("Name is required"),
  check("licence")
    .notEmpty()
    .withMessage("Licence is required"),

];
//
export { doctorRegisterValidator, nurseRegisterValidator , pharmacyRegisterValidator};
