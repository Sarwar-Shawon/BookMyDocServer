/*
 * @copyRight by md sarwar hoshen.
 */
import Patients from "../models/patients.js";
import Doctors from "../models/doctors.js";
import Nurses from "../models/nurses.js";
import Pharmacy from "../models/pharmacies.js";
import Users from "../models/users.js";
import { getToken } from "../utils/getToken.js";
import jwt from "jsonwebtoken";
import mailSender from "../services/mailSender.js";
//
const getProfile = async (req, res) => {
  try {
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "user not found" });
    }
    let user = {}

    if(curUser.roles.toLowerCase() == "doctor"){
        user =  await Doctors.findOne({ doc_email: curUser.email });
    }
    else if(curUser.roles.toLowerCase() == "patient"){
        user =  await Patients.findOne({ pt_email: curUser.email });
    }
    else if(curUser.roles.toLowerCase() == "nurse"){
        user =  await Nurses.findOne({ nur_email: curUser.email });
    }
    else if(curUser.roles.toLowerCase() == "pharmacy"){
        user =  await Pharmacy.findOne({ phr_email: curUser.email });

    }else{
      return res.status(422).json({ success: false, error: "user not found" });
    }
    //
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
export {
  //
  getProfile
};
