/*
 * @copyRight by md sarwar hoshen.
 */
import jwt from "jsonwebtoken";
import {getToken} from "../utils/getToken.js";
import Nurses from "../models/nurses.js";
import Doctors from "../models/doctors.js";
import Patients from "../models/patients.js";
//
const auth = async (req, res, next) => {
  const accessToken = getToken(req.headers["authorization"]);
  //
  const refreshToken = req.cookies["_aprt"];
  if (!accessToken || !refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }
  try {
    const tokenDetails = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req.user = tokenDetails;
    next();
  } catch (err) {
    // console.log(err);
    res.status(403).json({
      success: false,
      error: "Access Denied: Invalid token",
    });
  }
};
//
const checkAuthRole = (UserRoles) => async (req, res, next) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    //
    const user = jwt.decode(
      token
    );
    // console.log("useruseruseruser:::", user);
    //
    let { roles } = user;
    if (!roles) throw "Access Denied: Invalid user";
    !UserRoles.includes(roles)
      ? res.status(401).json({
          success: false,
          error: "Sorry you do not have access to this route",
        })
      : next();
  } catch (err) {
    // console.log(err);
    res.status(403).json({
      success: false,
      error: "Access Denied: Invalid user",
    });
  }
};
// verify doctor
const verifyDoctor = async (req, res, next) => {
  try {
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    const doctor = await Doctors.findOne({ doc_email: curUser.email });
    if (!doctor) {
      return res.status(422).json({ success: false, error: "No user found" });
    }
    req.doctor = doctor;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
// verify nurse to access doctor
const verifyNurseForDoctor = async (req, res, next) => {
  try {
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    const nurse = await Nurses.findOne({ nur_email: curUser.email });
    if (!nurse) {
      return res.status(422).json({ success: false, error: "No user found" });
    }
    //
    const doctor = await Doctors.findOne({
      $and: [
        { _id: req.query.doc_id }, 
        { nurses: { $in: [nurse._id] } } 
      ]
    }).select(
      ["_id"]
    );
    if (!doctor) {
      return res.status(422).json({ success: false, error: "No user found" });
    }
    req.doctor = doctor;
    next(); 
    //
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
// verify patient
const verifyPatient = async (req, res, next) => {
  try {
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    const patient = await Patients.findOne({ pt_email: curUser.email });
    if (!patient) {
      return res.status(422).json({ success: false, error: "No user found" });
    }
    req.patient = patient;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
export { auth, checkAuthRole, verifyDoctor, verifyNurseForDoctor, verifyPatient };
