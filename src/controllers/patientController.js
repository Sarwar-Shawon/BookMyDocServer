/*
 * @copyRight by md sarwar hoshen.
 */
import Doctors from "../models/doctors.js";
import Organizations from "../models/organization.js";

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
  getDoctors,
  getDoctorsByDepartment
};
