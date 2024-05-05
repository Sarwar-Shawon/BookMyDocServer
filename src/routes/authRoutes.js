/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import {
  signUpPatients,
  login,
  logout,
  CreateNewAccessToken,
  verifyPatientsAccount,
  changePassword,
  sendForgotPasswordOtp,
  forgotPasswordChange,
  requestNewOtp
} from "../controllers/authController.js";
import {
  loginValidator,
  changePasswordValidator,
  changeForgotPasswordValidator,
  registerValidator
} from "../Validator/authValidator.js";
import { auth, checkAuthRole } from "../middleware/auth.js";
import { validateReq } from "../middleware/validateMiddleware.js";
import roles from "../helpers/roles.js";
const authRouter = express.Router();
//create new patient account
authRouter.route("/register").post(registerValidator,validateReq, signUpPatients);
//verify new patient account
authRouter.route("/verifySignupOtp").post(verifyPatientsAccount);
//login to system
authRouter.route("/login").post(loginValidator,validateReq, login);
//generate new token 
authRouter.route("/refreshToken").get(CreateNewAccessToken);
//logout
authRouter.route("/logout").delete(auth, logout);
//change password
authRouter.route("/changePassword").put(changePasswordValidator ,validateReq, auth, checkAuthRole([roles.Doctor,roles.Nurse,roles.Pharmacy, roles.Patient, roles.Admin]) , changePassword);
//send otp to forgot password
authRouter.route("/sendforgotPasswordOtp").post(sendForgotPasswordOtp);
//change forgot password
authRouter.route("/changeForgotPassword").post(changeForgotPasswordValidator,validateReq,forgotPasswordChange);
//
authRouter.route("/requestOtp").get(requestNewOtp);
//
export default authRouter;
