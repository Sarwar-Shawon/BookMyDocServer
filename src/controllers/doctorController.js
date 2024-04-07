/*
 * @copyRight by md sarwar hoshen.
 */
import Doctors from "../models/doctors.js";
import jwt from "jsonwebtoken";
import {getToken} from "../utils/getToken.js";
//
const getProfile = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    //
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "session expired" });
    }
    const doctor = await Doctors.findOne({ doc_email: curUser.email })
      .populate("dept", { _id: 1, name: 1 })
      .populate("organization", { _id: 1, name: 1, addr: 1 });
    //
    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
export { getProfile };
