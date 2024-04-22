/*
 * @copyRight by md sarwar hoshen.
 */
import Patients from "../models/patients.js";
import Doctors from "../models/doctors.js";
import Nurses from "../models/nurses.js";
import Pharmacy from "../models/pharmacies.js";
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
        user =  await Doctors.findOne({ doc_email: curUser.email })
        .populate("dept", { _id: 1, name: 1 })
        .populate("organization", { _id: 1, name: 1, addr: 1 })
        .populate('nurses', { _id: 1, f_name: 1, l_name: 1 });
    }
    else if(curUser.roles.toLowerCase() == "patient"){
        user =  await Patients.findOne({ pt_email: curUser.email });
    }
    else if(curUser.roles.toLowerCase() == "nurse"){
        user =  await Nurses.findOne({ nur_email: curUser.email })
        .populate("dept", { _id: 1, name: 1 })
        .populate("organization", { _id: 1, name: 1, addr: 1 });
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
const updateProfile = async (req, res) => {
  try {
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "user not found" });
    }
    let user;
    const params = req.body;
    let imgUrl = "";
    if (req.files['img']) {
      imgUrl = req.files['img'][0].filename;
    }
    if(imgUrl)
      params.img = imgUrl
    
    let pSignUrl = "";
    if (req.files['pSign']) {
      pSignUrl = req.files['pSign'][0].filename;
    }
    if(pSignUrl)
      params.pSign = pSignUrl
    //
    if (curUser.roles.toLowerCase() === "doctor") {
      user = await Doctors.findOneAndUpdate(
        { doc_email: curUser.email },
        params,
        { new: true }
      );
    } else if (curUser.roles.toLowerCase() === "patient") {
      user = await Patients.findOneAndUpdate(
        { pt_email: curUser.email },
        params,
        { new: true }
      );
    } else if (curUser.roles.toLowerCase() === "nurse") {
      user = await Nurses.findOneAndUpdate(
        { nur_email: curUser.email },
        params,
        { new: true }
      );
    } else if (curUser.roles.toLowerCase() === "pharmacy") {
      user = await Pharmacy.findOneAndUpdate(
        { phr_email: curUser.email },
        params,
        { new: true }
      );
    } else {
      return res.status(422).json({ success: false, error: "user not found" });
    }
    if (!user) {
      return res.status(422).json({ success: false, error: "user not found" });
    }
    return res.status(200).json({ success: true, data: user , message: "You have updated profile successfully." });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
export {
  //
  getProfile,
  updateProfile
};
