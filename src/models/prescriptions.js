/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const prescriptionsSchema = new mongoose.Schema({
  pt_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patients",
    required: true
  },
  doc_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctors",
    required: true

  },
  phar_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacies"
  },
  apt_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointments"
  },
  createdAt:{
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: String,
    default: "Created",
    enum: ["Created", "Published" , "Delivered"],
    required: true
  },
  pulished_dt:{
    type: Date,
    default: Date.now,
  },
  reasons: [],
  medications: [],
  tests: [],
  investigations: [],
});
//
const Prescriptions = mongoose.model("Prescriptions", prescriptionsSchema);
//
export default Prescriptions;
