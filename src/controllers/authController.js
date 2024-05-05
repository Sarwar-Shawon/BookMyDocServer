/*
 * @copyRight by md sarwar hoshen.
 */
import Patients from "../models/patients.js";
import Users from "../models/users.js";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import Otps from "../models/otpModels.js";
import mailSender from "../services/mailSender.js";
import UserToken from "../models/userToken.js";
import { generateTokens } from "../utils/generateTokens.js";
import { verifyRefreshToken } from "../utils/verifyRefreshToken.js";
import { hashPassword, comparePassword } from "../utils/encryptPassword.js";
import { getToken } from "../utils/getToken.js";

//to register new patients
const signUpPatients = async (req, res) => {
  try {
    //hash password
    const hash_password = await hashPassword(req.body.password);
    //save to users table
    const newUser = await Users.create({
      email: req.body.username.trim().toLowerCase(),
      password: hash_password,
      pas_cg_rq: false,
      user_type: "Patient",
      isVerified: false,
    });
    //save to patients table
    const newPatient = await Patients.create({
      pt_email: req.body.username.trim().toLowerCase(),
      f_name: req.body.firstName,
      l_name: req.body.lastName,
      dob: req.body.dob,
      gender: req.body.gender,
      nhs: req.body.nhsId,
    });
    //
    if (newPatient.pt_email && newUser.email)
      await sendOTP({ email: req.body.username });

    //
    const payload = { user_id: req.body.username, roles: "Patients" };
    const otpAccessToken = jwt.sign(
      payload,
      process.env.OTP_TOKEN_PRIVATE_KEY,
      { expiresIn: process.env.OTP_ACCESS_TOKEN_LIFE }
    );
    //return response
    return res
      .cookie("_apot", otpAccessToken, {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "none",
        maxAge: 5 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message:
          "You've successfully created a new account. An OTP has been sent to your address.",
      });
  } catch (err) {
    //return err
    if (err.code == "11000") {
      res.status(409).json({
        success: false,
        status: "exists",
        error: "User Email Already Exists.",
      });
    } else {
      res.status(422).json({ success: false, error: err?.message });
    }
  }
};
//to sign in
const login = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const user = await Users.findOne({ email: req.body.username });
    console.log("user::", user);
    if (user) {
      const matchPass = await comparePassword(req.body.password, user.password);
      if (matchPass) {
        // check account is verified or not
        // if(!user.isVerified){
        //   await sendOTP({email: req.body.username})
        //   return res.status(400).json({
        //     success: false,
        //     status: 'not-verified',
        //     data: "your account is not verified, an otp has been sent to your account please verify your account.",
        //   });
        // }
        // generate jwt token
        const { accessToken, refreshToken } = await generateTokens(user);
        //return response
        return (
          res
            .cookie("_aprt", refreshToken, {
              httpOnly: true,
              path: "/",
              secure: true,
              sameSite: "none",
              maxAge: 30 * 24 * 60 * 60 * 1000,
            })
            // .header("Authorization", accessToken)
            .json({
              success: true,
              data: {
                email: user.email,
                pas_cg_rq: user.pas_cg_rq,
                user_type: user.user_type,
                isVerified: user.isVerified,
                token: accessToken,
              },
            })
        );
      } else {
        return res.status(500).json({
          success: false,
          error: "username or password doesn't match",
        });
      }
    } else {
      return res.status(403).json({ success: false, error: "No user found." });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
// sign out
const logout = async (req, res) => {
  try {
    console.log("req.headers.cookies", req.cookies["_aprt"]);
    await UserToken.findOneAndDelete({
      token: req.cookies["_aprt"],
    });
    return res
      .cookie("_aprt", "", {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "none",
        expires: new Date(0), // Set expiration date to past
      })
      .status(200)
      .json({ success: true, message: "Logged Out Sucessfully" });
  } catch (err) {
    res.status(422).json({ success: false, error: "Internal Server Error" });
  }
};
//CreateNewAccessToken
const CreateNewAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies["_aprt"];
    if (!refreshToken) {
      return res.status(401).send("Access Denied. No refresh token provided.");
    }
    const { tokenDetails, success } = await verifyRefreshToken(refreshToken);
    const payload = {
      _id: tokenDetails._id,
      roles: tokenDetails.roles,
      email: tokenDetails.email,
    };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      {
        expiresIn: process.env.ACCESS_TOKEN_LIFE,
      }
    );
    res.json({
      success: true,
      token: accessToken,
    });
  } catch (err) {
    res.json({
      success: false,
      err: err?.message,
    });
  }
};
//verifyPatientsAccount
const verifyPatientsAccount = async (req, res) => {
  try {
    //check validation fields
    if (!req.body.otp) {
      return res.status(422).json({ success: false, error: "Otp is required" });
    }
    const user = jwt.decode(req.cookies["_apot"]);
    console.log("user:::", user);
    if (!user) {
      return res.status(422).json({ success: false, error: "session expired" });
    }
    const findOtp = await verifyOTP({
      email: user.user_id,
      otp: req.body.otp,
    });
    console.log("findOtp:::", findOtp);
    if (findOtp?.success) {
      //update user verified
      await Users.findOneAndUpdate(
        { email: user.user_id },
        { $set: { isVerified: true } },
        { new: true }
      );
      res
        .cookie("_apot", "", {
          httpOnly: true,
          path: "/",
          secure: true,
          sameSite: "none",
          maxAge: new Date(0),
        })
        .status(200)
        .json({
          success: true,
          message:
            "Congratulations you have successfully verified your account.",
        });
    } else {
      res.status(400).json({ success: false, error: "Invalid OTP" });
    }
  } catch (err) {
    //return err
    res.status(422).json({ success: false, error: err?.message });
  }
};
//changePassword
const changePassword = async (req, res) => {
  try {
    console.log("reqreqreqreq:::", req.body);
    //
    const token = getToken(req.headers["authorization"]);
    //
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "session expired" });
    }
    //
    const user = await Users.findOne({ email: curUser.email });
    // console.log("user::", user);
    if (user) {
      const matchPass = await comparePassword(
        req.body.old_password,
        user.password
      );
      if (matchPass) {
        user.password = await hashPassword(req.body.new_password);
        user.pas_cg_rq = false;
        //
        await user.save();
        // return success response
        res.status(200).json({
          success: true,
          message: "Password has changed successfully",
        });
      } else {
        // id password not matched
        return res.status(500).json({
          success: false,
          error: "old password doesn't match",
        });
      }
    } else {
      return res.status(403).json({ success: false, error: "No user found." });
    }
    //
  } catch (err) {
    //return err
    res.status(422).json({ success: false, error: err?.message });
  }
};
//sendForgotPasswordOtp
const sendForgotPasswordOtp = async (req, res) => {
  try {
    //check validation fields
    if (!req.body.username) {
      return res
        .status(422)
        .json({ success: false, error: "user email is required" });
    }
    //
    const user = await Users.findOne({ email: req.body.username });
    console.log("user::", user);
    if (user) {
      //
      await sendOTP({ email: req.body.username });
      //
      res.status(200).json({
        success: true,
        message: "An OTP has been sent to your email address.",
      });
    } else {
      return res.status(403).json({ success: false, error: "No user found." });
    }
    //
  } catch (err) {
    //return err
    res.status(422).json({ success: false, error: err?.message });
  }
};
//forgotPasswordChange
const forgotPasswordChange = async (req, res) => {
  try {
    //
    const findOtp = await verifyOTP({
      email: req.body.username,
      otp: req.body.otp,
    });
    if (findOtp?.success) {
      const user = await Users.findOne({ email: req.body.username });
      console.log("user::", user);
      if (user) {
        user.password = await hashPassword(req.body.new_password);
        //
        await Users.save();
        //
        res.status(200).json({
          success: true,
          message: "Password has changed successfully",
        });
      } else {
        return res
          .status(403)
          .json({ success: false, error: "No user found." });
      }
    } else {
      res.status(400).json({ success: false, error: "Invalid OTP" });
    }
    //
  } catch (err) {
    //return err
    res.status(422).json({ success: false, error: err?.message });
  }
};
// Send OTP to the email
const sendOTP = async (obj) => {
  try {
    const otp = randomstring.generate({
      length: 6,
      charset: "numeric",
    });
    const newOTP = new Otps({ email: obj.email, otp, ct: Date.now() });
    //save otp to database
    await newOTP.save();
    // Send otp
    await mailSender({
      to: obj.email,
      subject: "OTP Confirmation",
      body: `<p>This is your OTP : <strong>${otp}</strong> Please enter this OTP within 5 minutes, after 5 minutes this OTP will be expired. </p>`,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};
//verifyOTP
const verifyOTP = async (obj) => {
  try {
    const findOtp = await Otps.findOneAndDelete({
      email: obj.email,
      otp: obj.otp,
    });
    if (findOtp) {
      return { success: true };
    } else {
      return { success: false };
    }
  } catch (err) {
    //return err
    throw err;
  }
};
//
const requestNewOtp = async (req, res) => {
  try {
    const user = jwt.decode(req.cookies["_apot"]);
    //
    console.log("user", user);
    if (!user) {
      return res.status(422).json({ success: false, error: "session expired" });
    }
    const findOtp = await Otps.findOneAndDelete({ email: user.user_id });
    await sendOTP({ email: user.user_id });
    //
    return res
      .cookie("_apot", otpAccessToken, {
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "none",
        maxAge: 5 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "A new otp has sent to your account.",
      });
  } catch (err) {
    //return err
    if (err.code == "11000") {
      res.status(409).json({
        success: false,
        status: "exists",
        error: "User Email Already Exists.",
      });
    } else {
      res.status(422).json({ success: false, error: err?.message });
    }
  }
};
//
export {
  signUpPatients,
  login,
  logout,
  CreateNewAccessToken,
  verifyPatientsAccount,
  changePassword,
  sendForgotPasswordOtp,
  forgotPasswordChange,
  requestNewOtp,
};
