/*
 * @copyRight by md sarwar hoshen.
 */
import randomstring from "randomstring";
import Nurses from "../models/nurse.js";
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
  const nurse = await Nurses.findOne({ nur_email: req.body.id })
  //
  res.status(200).json({
    success: true,
    data: nurse,
  });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });

  }
};