/*
 * @copyRight by md sarwar hoshen.
 */
import randomstring from "randomstring";
import Doctors from "../models/doctors.js";
import Nurses from "../models/nurses.js";
import Pharmacies from "../models/pharmacies.js";
import Users from "../models/users.js";
import roles from "../helpers/roles.js";
import mailSender from "../services/mailSender.js";
import { hashPassword } from "../utils/encryptPassword.js";
import Organizations from "../models/organization.js";
import Departments from "../models/departments.js";
//
const registerToSystem = async (obj) => {
  try {
    // generate random password
    const password = randomstring.generate({
      length: 16,
      charset: "alphanumeric",
    });
    //
    const user = new Users({
      email: obj.email,
      password: await hashPassword(password),
      pas_cg_rq: true,
      isVerified: true,
      user_type: obj.user_type,
      createAt: Date.now(),
    });
    //return response
    const saveUser = await user.save();
    if (saveUser._id) {
      await mailSender({
        to: obj.email,
        subject: "New Account",
        body: `<p>An admin is created your account this is your username: <strong>${obj.email}</strong> and this is your temporary password: . <strong>${password}</strong></n>
          You need to change your password when you log in to the system.
        </p>`,
      });
    }
    return { success: true, message: "Success." };
  } catch (err) {
    //return err
    if (err.code == 11000) {
      return { success: false, error: "This email is already exists." };
    } else {
      throw err;
    }
  }
};
//
const deleteUsers = async (obj) => {
  try {
    const user = await Users.findOne({ email: obj.email });
    //console.log("user", user);
    //console.log("user", obj);
    if (!user) {
      throw "No user found";
    }
    await user.deleteOne();
  } catch (err) {
    throw err;
  }
};
/*
 * Doctors.
 */

// add new doctor to system
const registerNewDoctror = async (req, res) => {
  try {
    let imgUrl = "";
    if (req.file?.originalname) {
      imgUrl = req.file.filename;
    }
    const doctor = new Doctors({
      doc_email: req.body.doc_email,
      f_name: req.body.f_name,
      l_name: req.body.l_name,
      dob: req.body.dob,
      phone: req.body.phone,
      gmc_licence: req.body.gmc_licence,
      // addr: req.body.addr,
      active: req.body.active,
      dept: req.body.dept,
      gender: req.body.gender,
      organization: req.body.organization,
      img: imgUrl,
      nurses: req.body.nurses,
    });
    //save to db
    const saveData = await doctor.save();
    //
    await Doctors.populate(saveData, [
      { path: "dept", select: { _id: 1, name: 1 } },
      { path: "organization", select: { _id: 1, name: 1, addr: 1 } },
    ]);
    //
    const saveUser = await registerToSystem({
      email: req.body.doc_email,
      user_type: roles.Doctor,
    });
    //return response
    if (saveUser.success) {
      res.status(200).json({
        success: true,
        message: "You've successfully added a new doctor.",
        data: saveData,
      });
    } else {
      await Doctors.findOneAndDelete({ doc_email: req.body.doc_email });
      throw { message: saveUser.error };
    }
  } catch (err) {
    //console.log("registerNewDoctror::: err", err);
    //return err
    if (err.code == 11000) {
      res.status(500).json({
        success: false,
        error: "This email is already exists.",
      });
    } else {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};
// update to system
const updadteDoctor = async (req, res) => {
  try {
    let doctor = await Doctors.findOne({ _id: req.body._id });
    if (!doctor) {
      return res.status(400).json({
        success: false,
        error: "No doctor found.",
      });
    }
    let imgUrl = "";
    if (req.file?.originalname) {
      imgUrl = req.file.filename;
    } else {
      imgUrl = req.body.img;
    }
    doctor.f_name = req.body.f_name;
    doctor.l_name = req.body.l_name;
    doctor.dob = req.body.dob;
    doctor.phone = req.body.phone;
    doctor.gmc_licence = req.body.gmc_licence;
    doctor.gmc_licence = req.body.gmc_licence;
    // doctor.addr = req.body.addr;
    doctor.active = req.body.active;
    (doctor.gender = req.body.gender), (doctor.img = imgUrl);
    doctor.dept = req.body.dept;
    doctor.organization = req.body.organization;
    doctor.nurses = req.body.nurses;
    //update to db
    const updData = await doctor.save();
    //return response
    await Doctors.populate(updData, [
      { path: "dept", select: { _id: 1, name: 1 } },
      { path: "organization", select: { _id: 1, name: 1, addr: 1 } },
    ]);
    //
    res.status(200).json({
      success: true,
      message: "You've successfully updated the information.",
      data: updData,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get doctors
const getAllDoctors = async (req, res) => {
  try {
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 15;
    const query = {};
    if (req.query.dept) {
      query["dept"] = req.query.dept;
    }
    if (req.query.org) {
      query["organization"] = req.query.org;
    }
    const doctors = await Doctors.find(query)
      .populate("dept", { _id: 1, name: 1 })
      .populate("organization", { _id: 1, name: 1, addr: 1 })
      .skip(skip)
      .limit(limit);
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
// delete doctor
const deleteDoctor = async (req, res) => {
  try {
    //console.log("req.body", req.body);
    let doctor = await Doctors.findById(req.body._id);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        error: "No doctor found.",
      });
    }
    const deletePromises = [
      deleteUsers({ email: doctor.doc_email }),
      doctor.deleteOne(),
    ];
    await Promise.all(deletePromises);
    //
    res.status(200).json({
      success: true,
      message: "You've successfully deleted the doctor.",
      data: req.body._id,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
/*
 * Nurses.
 */

// add new nurse to system
const registerNewNurse = async (req, res) => {
  try {
    let imgUrl = "";
    if (req.file?.originalname) {
      imgUrl = req.file.filename;
    }
    const nurse = new Nurses({
      //params
      nur_email: req.body.nur_email,
      f_name: req.body.f_name,
      l_name: req.body.l_name,
      dob: req.body.dob,
      phone: req.body.phone,
      gmc_licence: req.body.gmc_licence,
      gender: req.body.gender,
      active: req.body.active,
      dept: req.body.dept,
      organization: req.body.organization,
      img: imgUrl,
    });
    //save to db
    const saveData = await nurse.save();
    //
    // await saveData.populate("dept", { '_id': 1, 'name': 1 });

    await Nurses.populate(saveData, [
      { path: "dept", select: { _id: 1, name: 1 } },
      { path: "organization", select: { _id: 1, name: 1, addr: 1 } },
    ]);
    //
    const saveUser = await registerToSystem({
      email: req.body.nur_email,
      user_type: roles.Nurse,
    });
    //return response
    if (saveUser.success) {
      res.status(200).json({
        success: true,
        message: "You've successfully added a new nurse.",
        data: saveData,
      });
    } else {
      await Nurses.findOneAndDelete({ nur_email: req.body.nur_email });
      throw { message: saveUser.error };
    }
  } catch (err) {
    //console.log("registerNewNurse::: err", err);
    //return err
    if (err.code == 11000) {
      res.status(500).json({
        success: false,
        error: "This email is already exists.",
      });
    } else {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};
// update nurse to system
const updadteNurse = async (req, res) => {
  try {
    const nurse = await Nurses.findOne({ _id: req.body._id });
    if (!nurse) {
      return res.status(400).json({
        success: false,
        error: "No nurse found.",
      });
    }
    let imgUrl = "";
    if (req.file?.filename) {
      imgUrl = req.file.filename;
    } else {
      imgUrl = req.body.img;
    }
    nurse.f_name = req.body.f_name;
    nurse.l_name = req.body.l_name;
    nurse.dob = req.body.dob;
    nurse.phone = req.body.phone;
    nurse.nhs_id = req.body.nhs_id;
    // nurse.addr = req.body.addr;
    nurse.dept = req.body.dept;
    (nurse.gender = req.body.gender), (nurse.active = req.body.active);
    nurse.organization = req.body.organization;
    nurse.img = imgUrl;
    //save to db
    const updNur = await nurse.save();
    //
    // await updNur.populate("dept", { '_id': 1, 'name': 1 });
    await Nurses.populate(updNur, [
      { path: "dept", select: { _id: 1, name: 1 } },
      { path: "organization", select: { _id: 1, name: 1, addr: 1 } },
    ]);
    //return response
    res.status(200).json({
      success: true,
      message: "You've successfully updated the information.",
      data: updNur,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get all nurses
const getAllNurses = async (req, res) => {
  try {
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 15;
    const query = {};
    if (req.query.dept) {
      query["dept"] = req.query.dept;
    }
    if (req.query.org) {
      query["organization"] = req.query.org;
    }
    const nurses = await Nurses.find(query)
      .populate("dept", { _id: 1, name: 1 })
      .populate("organization", { _id: 1, name: 1, addr: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: nurses,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get all nurses
const getAllNursesByDeptAndOrg = async (req, res) => {
  try {
    if (!req.query.dept && !req.query.org) {
      return res.status(500).json({
        success: false,
        error: "please select department and organization",
      });
    }
    const nurses = await Nurses.find({
      dept: req.query.dept,
      organization: req.query.org,
    });
    //
    res.status(200).json({
      success: true,
      data: nurses,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
// delete nurse
const deleteNurse = async (req, res) => {
  try {
    let nurse = await Nurses.findById(req.body._id);
    if (!nurse) {
      return res.status(400).json({
        success: false,
        error: "No nurse found.",
      });
    }
    const deletePromises = [
      deleteUsers({ email: nurse.nur_email }),
      nurse.deleteOne(),
    ];
    await Promise.all(deletePromises);
    //
    res.status(200).json({
      success: true,
      message: "You've successfully deleted the nurse.",
      data: req.body._id,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
/*
 * Pharmacy.
 */

// add new pharmacy to system
const registerNewPharmacy = async (req, res) => {
  try {
    let imgUrl = "";
    if (req.file?.originalname) {
      imgUrl = req.file.filename;
    }
    const pharmacy = new Pharmacies({
      //params
      phar_email: req.body.phar_email,
      name: req.body.name,
      licence: req.body.licence,
      phone: req.body.phone,
      img: imgUrl,
      addr: req.body.addr,
      org: req.body.org,
      active: req.body.active,
    });
    //save to db
    const saveData = await pharmacy.save();
    //
    await Pharmacies.populate(saveData, [
      { path: "org", select: { _id: 1, name: 1 } },
    ]);
    const saveUser = await registerToSystem({
      email: req.body.phar_email,
      user_type: roles.Pharmacy,
    });
    //return response
    if (saveUser.success) {
      res.status(200).json({
        success: true,
        message: "You've successfully added a new pharmacy.",
        data: saveData,
      });
    } else {
      await Pharmacies.findOneAndDelete({ phar_email: req.body.phar_email });
      throw { message: saveUser.error };
    }
  } catch (err) {
    //console.log("registerNewPharmacy:: err", err);
    //return err
    if (err.code == 11000) {
      res.status(500).json({
        success: false,
        error: "This email is already exists.",
      });
    } else {
      return res.status(500).json({ success: false, error: err.message });
    }
  }
};
// update pharmacy to system
const updadtePharmacy = async (req, res) => {
  try {
    let pharmacy = await Pharmacies.findOne({ _id: req.body._id });
    if (!pharmacy) {
      return res.status(400).json({
        success: false,
        error: "No pharmacy found.",
      });
    }
    let imgUrl = "";
    if (req.file?.filename) {
      imgUrl = req.file.filename;
    } else {
      imgUrl = req.body.img;
    }
    pharmacy.name = req.body.name;
    pharmacy.licence = req.body.licence;
    pharmacy.phone = req.body.phone;
    pharmacy.img = req.body.img;
    pharmacy.addr = req.body.addr;
    pharmacy.active = req.body.active;
    pharmacy.org = req.body.org;
    pharmacy.img = imgUrl;
    //update to db
    const updData = await pharmacy.save();
    //return response
    await Pharmacies.populate(updData, [
      { path: "org", select: { _id: 1, name: 1 } },
    ]);
    res.status(200).json({
      success: true,
      message: "You've successfully updated the information.",
      data: updData,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get all pharmacies
const getAllPharmacies = async (req, res) => {
  try {
    const skip =
      req.query.skip && /^\d+$/.test(req.query.skip)
        ? Number(req.query.skip)
        : 0;
    const limit = req.query.limit || 15;
    const query = {};
    if (req.query.org) {
      query["org"] = req.query.org;
    }
    const pharmacies = await Pharmacies.find(query)
      .populate("org", { _id: 1, name: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: pharmacies,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
// delete pharmacy
const deletePharmacy = async (req, res) => {
  try {
    let pharmacy = await Pharmacies.findById(req.body._id);
    if (!pharmacy) {
      return res.status(400).json({
        success: false,
        error: "No pharmacy found.",
      });
    }
    const deletePromises = [
      deleteUsers({ email: pharmacy.phar_email }),
      pharmacy.deleteOne(),
    ];
    await Promise.all(deletePromises);
    //
    res.status(200).json({
      success: true,
      message: "You've successfully deleted the pharmacy.",
      data: req.body._id,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
const getAdminDashboard = async (req, res) => {
  try {
    const [
      organizationsCount,
      departmentsCount,
      doctorsCount,
      nursesCount,
      pharmaciesCount,
    ] = await Promise.all([
      Organizations.countDocuments(),
      Departments.countDocuments(),
      Doctors.countDocuments(),
      Nurses.countDocuments(),
      Pharmacies.countDocuments(),
    ]);
    //
    const data = {
      organizations: organizationsCount,
      departments: departmentsCount,
      doctors: doctorsCount,
      nurses: nursesCount,
      pharmacies: pharmaciesCount,
    };
    //
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
export {
  //
  registerNewDoctror,
  getAllDoctors,
  updadteDoctor,
  deleteDoctor,
  //
  registerNewNurse,
  updadteNurse,
  deleteNurse,
  getAllNurses,
  getAllNursesByDeptAndOrg,
  //
  registerNewPharmacy,
  updadtePharmacy,
  deletePharmacy,
  getAllPharmacies,
  //
  getAdminDashboard,
};

// Doctors.find({})
//   .populate({
//     path: "organization",
//     match: { "location.latlng": { $eq: [organizationLat, organizationLng] } }
//   })
//   .exec((err, doctors) => {
//     if (err) {
//       console.error(err);
//       // Handle error
//     } else {
//       // Filter out doctors whose organization does not match the location
//       const filteredDoctors = doctors.filter(doctor => doctor.organization !== null);

//       // Do something with filteredDoctors
//     }
//   });
