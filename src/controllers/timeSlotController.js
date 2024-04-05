/*
 * @copyRight by md sarwar hoshen.
 */
import Doctors from "../models/doctors.js";
import Patients from "../models/patients.js";
import TimeSlots from "../models/TimeSlots.js";
import Appointments from "../models/appointments.js";
import jwt from "jsonwebtoken";
import {getToken} from "../utils/getToken.js";

//
const dayMapping = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday"
};
//create
const createTimeSlot = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    //
    const curUser = jwt.decode(token);
    const doctor = await Doctors.findOne({ doc_email: curUser.email });
    if (!doctor) {
      return res.status(422).json({ success: false, error: "No doctor found" });
    }
    const timeSlots = new TimeSlots({
      timeSlots: req.body.timeSlots,
      doctor: doctor._id,
      messege: "You've successfully created timeslots.",

    });
    //
    await timeSlots.save()

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//update
const updateTimeSlot = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    //
    const curUser = jwt.decode(token);
    const doctor = await Doctors.findOne({ doc_email: curUser.email });
    if (!doctor) {
      return res.status(422).json({ success: false, error: "No doctor found" });
    }
    const doctorSlots = await TimeSlots.findOne({
      doctor: doctor._id,
    });
    //
    doctorSlots.timeSlots = req.body.timeSlots
    //
    await doctorSlots.save()
    //
    res.status(200).json({
      success: true,
      message: "You've successfully updated timeslots.",
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get
const getTimeSlots = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    const doctor = await Doctors.findOne({ doc_email: curUser.email });
    if (!doctor) {
      return res.status(422).json({ success: false, error: "No doctor found" });
    }
    console.log("req.query.date::", req.query.date)
    const date = new Date(req.query.date);
    //
    const data = await TimeSlots.findOne({ doctor: doctor._id });
    //
    res.status(200).json({
      success: true,
      data: data.timeSlots,
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get
const getTimeSlotsForPatient = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    const [patient, doctor] = await Promise.all([
      Patients.findOne({ pt_email: curUser.email }),
      Doctors.findOne({ doc_email: req.query.doc_email }),
    ]);
    if (!patient && !doctor) {
      return res.status(422).json({ success: false, error: "No data found" });
    }
    const date = new Date(req.query.date);
    const startOfDay = new Date(req.query.startDay || date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(req.query.endDay || date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const day = dayMapping[startOfDay.getDay()]
    console.log("startOfDay",startOfDay)
    console.log("endOfDay",endOfDay)
    console.log("day",day)
    const timeSlotsAvailabilityData = await Appointments.find({ 
        doc: doctor._id,
        apt_date: {
            $gte: startOfDay, 
            $lte: endOfDay     
        }
    });
    //
    console.log("timeSlotsAvailabilityData", timeSlotsAvailabilityData);
    //
    const data = await TimeSlots.findOne({ doctor: doctor._id });
    
    console.log('data:::',data)
    if(timeSlotsAvailabilityData.length){
      timeSlotsAvailabilityData.map((item)=>{
          if(data.timeSlots[day] && data.timeSlots[day][item.timeslot]){
                console.log("data.timeSlots[day][item.timeslot]", data.timeSlots[day][item.timeslot])
                data.timeSlots[day][item.timeslot].active = false;
                data.timeSlots[day][item.timeslot].aptId = "1223";
          }
      })
    }
    //
    res.status(200).json({
      success: true,
      data: data?.timeSlots[day] || {},
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//get
const getTimeSlotsByDate = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    const doctor = await Doctors.findOne({ doc_email: curUser.email });
    if (!doctor) {
      return res.status(422).json({ success: false, error: "No doctor found" });
    }
    console.log("req.query.date::", req.query.date)
    const date = new Date(req.query.date);
    console.log("req.query.date::", date)

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    const day = dayMapping[startOfDay.getDay()]

    const timeSlotsAvailabilityData = await Appointments.find({ 
      doc: doctor._id,
      apt_date: {
          $gte: startOfDay,
          $lte: endOfDay
      }
  });
    //
    console.log("timeSlotsAvailabilityData", timeSlotsAvailabilityData);
    //
    const data = await TimeSlots.findOne({ doctor: doctor._id });
    if(timeSlotsAvailabilityData){
      timeSlotsAvailabilityData.map((item)=>{
          if(data.timeSlots[day] && data.timeSlots[day][item.timeslot]){
                console.log("data.timeSlots[day][item.timeslot]", data.timeSlots[day][item.timeslot])
                data.timeSlots[day][item.timeslot].active = false;
                data.timeSlots[day][item.timeslot].aptId = item._id;
          }
      })
    }
    //
    res.status(200).json({
      success: true,
      data: data?.timeSlots[day] || {}
    });
  } catch (err) {
    //return err
    return res.status(500).json({ success: false, error: err.message });
  }
};
//
export { createTimeSlot, updateTimeSlot , getTimeSlots, getTimeSlotsForPatient, getTimeSlotsByDate };
