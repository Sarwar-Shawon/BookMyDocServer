/*
 * @copyRight by md sarwar hoshen.
 */
import Nurses from "../models/nurses.js";
import Doctors from "../models/doctors.js";
import mailSender from "../services/mailSender.js";
import { getToken } from "../utils/getToken.js";
import jwt from "jsonwebtoken";

//
const getProfile = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "session expired" });
    }
    const nurse = await Nurses.findOne({ nur_email: curUser.email });
    if (!nurse) {
      return res.status(422).json({ success: false, error: "no user found" });
    }
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get attached doctors
const getAttachDoctors = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "session expired" });
    }
    const nurse = await Nurses.findOne({ nur_email: curUser.email });
    if (!nurse) {
      return res.status(422).json({ success: false, error: "no user found" });
    }
    //
    const doctors = await Doctors.find({ nurses: { $in: [nurse._id] } }).select(
      ["_id", "f_name", "l_name", "doc_email"]
    );
    //
    res.status(200).json({
      success: true,
      data: doctors,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
export { getProfile, getAttachDoctors };
