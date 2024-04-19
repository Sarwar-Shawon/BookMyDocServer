/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const prescriptionsSchema = new mongoose.Schema({
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
  phar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacies"
  },
  apt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointments"
  },
  createdAt:{
    type: Date,
    default: Date.now,
    required: true
  },
  updateDt:{
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: String,
    default: "New",
    enum: ["New", "Repeated" , "Dispensed"],
    required: true
  },
  medications: [],
  validDt:{
    type: Date,
  },
  nshId:{
    type: String,
    required: true
  },
  payStatus:{
    type: String,
    default: "Unpaid",
    enum: ["Unpaid", "Paid" , "Refund"],
    required: true
  },
  amount:{
    type: String,
  },
  repeatReq:{
    type: Boolean,
    default: false
  },
  opid:{
    type: mongoose.Schema.Types.ObjectId
  },
});
//
const Prescriptions = mongoose.model("Prescriptions", prescriptionsSchema);
//
export default Prescriptions;
