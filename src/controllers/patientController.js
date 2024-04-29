/*
 * @copyRight by md sarwar hoshen.
 */
import Doctors from "../models/doctors.js";
import Organizations from "../models/organization.js";
import Patients from "../models/patients.js";
import jwt from "jsonwebtoken";
import {getToken} from "../utils/getToken.js";
//get all doctors
const getDoctors = async (req, res) => {
  try {
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 15;
    //
    const query = {
      active: true
    }
    if(req.query.lat && req.query.lng){
      query.organization = {
        $in: await Organizations.find({
          "addr.lat_lng": {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [req.query.lat,req.query.lng],
              },
              $maxDistance: 21 * 1609.34,
            },
          },
        }).distinct("_id"),
      }
    }
    const doctors = await Doctors.find(query)
      .populate("dept", { _id: 1, name: 1 })
      .populate("organization", { _id: 1, name: 1, addr: 1 })
      .select({ f_name: 1, l_name: 1, dept: 1, organization: 1, img: 1, _id: 1, doc_email: 1 })
      .skip(skip)
      .limit(limit);
    //
    res.status(200).json({
      success: true,
      data: doctors,
    });
    //
  } catch (err) {
    //return err
    console.log("err", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get doctors by department
const getDoctorsByDepartment = async (req, res) => {
  try {
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 15;
    //
    const query = {
      dept: req.query.dept,
      active: true,
    };
    if (req.query.lat && req.query.lng) {
      query.organization = {
        $in: await Organizations.find({
          "addr.lat_lng": {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [req.query.lat, req.query.lng],
              },
              $maxDistance: 21 * 1609.34,
            },
          },
        }).distinct("_id"),
      };
    }
    const doctors = await Doctors.find(query)
      .populate("dept", { _id: 1, name: 1 })
      .populate("organization", { _id: 1, name: 1, addr: 1 })
      .select({ f_name: 1, l_name: 1, dept: 1, organization: 1, img: 1, _id: 1 , doc_email: 1 })
      .skip(skip)
      .limit(limit);

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
const updatePatientHealthRecord = async (req, res) => {
  try {
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "user not found" });
    }
    //
    const patient = await Patients.findById(req.body.pt_id);
    console.log("patient",patient)
    patient.medical_history = req.body.medical_history;
    patient.save()
    //
    res.status(200).json({
      success: true,
      data: patient.medical_history,
      message: "Patient record has been updated successfully"
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
export {
  //
  getDoctors,
  getDoctorsByDepartment,
  updatePatientHealthRecord
};
