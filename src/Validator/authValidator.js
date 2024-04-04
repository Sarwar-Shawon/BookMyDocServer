/*
 * @copyRight by md sarwar hoshen.
 */
import { check } from "express-validator";
//login Validator
const loginValidator = [
  //email
  check("username")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),
  //password
  check("password")
    .notEmpty()
    .withMessage("Password is required")
];
const registerValidator = [
  //email
  check("username")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("Invalid email format"),
  //password
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .bail()
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
    check("firstName")
    .notEmpty()
    .withMessage("user first name is required"),  
    check("dob")
    .notEmpty()
    .withMessage("user date of birth is required"),  
    check("gender")
    .notEmpty()
    .withMessage("user gender is required"),  
    check("nhsId")
    .notEmpty()
    .withMessage("user NHS Id is required"),  
];
//change password Validator
const changePasswordValidator = [
  check("old_password")
    .notEmpty()
    .withMessage("old password is required"),
  check("new_password")
    .notEmpty()
    .withMessage("new password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("new Password must be at least 8 characters long")
    .bail()
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/)
    .withMessage(
      "new Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];
//cahnge forgot password Validator
const changeForgotPasswordValidator = [
  check("otp")
    .notEmpty()
    .withMessage("otp is required"),
  check("new_password")
    .notEmpty()
    .withMessage("new password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("new Password must be at least 8 characters long")
    .bail()
    .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/)
    .withMessage(
      "new Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
];
//
export { loginValidator, changePasswordValidator,changeForgotPasswordValidator,registerValidator };
