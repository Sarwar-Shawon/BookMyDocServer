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
  createdAt:{
    type: Date,
    default: Date.now,
    required: true
  },
  status: {
    type: String,
    default: "Created",
    enum: ["Created", "Published" ],
    required: true
  },
  pulished_dt:{
    type: Date,
    default: Date.now,
  },
  pr_data: {
    type: String,
    default: "",
  },
});
//
const Prescriptions = mongoose.model("Prescriptions", prescriptionsSchema);
//
export default Prescriptions;
