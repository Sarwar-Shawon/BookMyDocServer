/*
 * @copyRight by md sarwar hoshen.
 */
import Departments from "../models/departments.js";
import Doctors from "../models/doctors.js";
import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

/*
 * Departments.
 */
// add new department to system
const createDepartment = async (req, res) => {
  try {
    let imgUrl = "";
    if (req.file?.filename) {
      imgUrl = req.file.filename;
    }
    const department = new Departments({
      name: req.body.name,
      details: req.body.details,
      img: imgUrl,
      active: req.body.active,
    });
    //save to db
    const saveData = await department.save();
    //
    //return response
    res.status(200).json({
      success: true,
      message: "You've successfully added a new department.",
      data: saveData
    });
  } catch (err) {
    //return err
    console.log("errerrerr::", err);
    if (err.code == "11000") {
      res.status(500).json({
        success: false,
        error: "This department name is already exists.",
      });
    } else {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};
// update department
const updadteDepartment = async (req, res) => {
  try {
    let department = await Departments.findOne({ _id: req.body._id });
    if (!department) {
      return res.status(400).json({
        success: false,
        error: "No department found.",
      });
    }
    let imgUrl = "";
    if (req.file?.originalname) {
      imgUrl = req.file.filename;
    } else {
      imgUrl = req.body.img;
    }
    department.name = req.body.name;
    department.details = req.body.details;
    department.img = imgUrl;
    department.active = req.body.active;
    //save to db
    await department.save();
    //return response
    res.status(200).json({
      success: true,
      message: "You've successfully updated department information.",
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
//get departments
const getDepartments = async (req, res) => {
  try {
    // const skip =
    //   req.query.skip && /^\d+$/.test(req.query.skip)
    //     ? Number(req.query.skip)
    //     : 0;
    // const limit = 10;
    const departments = await Departments.find({});
    //
    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (err) {
    //return err
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

    const doctors = await Doctors.find({
      dept: req.query.dept,
      active: true
    })
      .populate("dept", { _id: 1, name: 1 })
      .populate("organization", { _id: 1, name: 1, addr: 1 })
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
export {
  //
  createDepartment,
  getDepartments,
  updadteDepartment,
  getDoctorsByDepartment
};
