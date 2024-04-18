/*
 * @copyRight by md sarwar hoshen.
 */
import randomstring from "randomstring";
import Pharmacies from "../models/pharmacies.js";
import mailSender from "../services/mailSender.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//
const getProfile = async (req, res) => {
  try {
  //
  const pharmacy = await Pharmacies.findOne({ phar_email: req.body.id })
  //
  res.status(200).json({
    success: true,
    data: pharmacy,
  });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });

  }
};
//
//get all pharmacies
const getAllPharmaciesForDoctor = async (req, res) => {
  try {
    const pharmacies = await Pharmacies.find({org: req.doctor.organization})
      .populate("org", { _id: 1, name: 1 })

    res.status(200).json({
      success: true,
      data: pharmacies,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};

export {getAllPharmaciesForDoctor , getProfile}