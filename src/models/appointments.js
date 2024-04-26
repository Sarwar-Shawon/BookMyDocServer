/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const appointmentsSchema = new mongoose.Schema({
  pt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patients",
    required: true
  },
  doc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctors",
    required: true
  },
  apt_date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: "Accepted",
    enum: ["Pending", "Accepted", "Canceled"],
    required: true
  },
  createdAt:{
    type: Date,
    default: Date.now,
    required: true
  },
  dept:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
    required: true
  },
  org:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizations",
    required: true
  },
  timeslot:{
    type: String,
    required: true
  },
  uniqueId:{
    type: String,
    required: true,
    unique: true,
  },
  docInfo:{

  }

});
//
const Appointments = mongoose.model("Appoinments", appointmentsSchema);
//
export default Appointments;
