/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const patientsSchema = new mongoose.Schema({
  pt_email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  f_name: {
    type: String,
    default: "",
  },
  l_name: {
    type: String,
    default: "",
  },
  dob: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  nhs: {
    type: String,
    default: "",
  },
  img: {
    type: String,
  },
  gender: {
    type: String,
  },
  addr:{
    type: Object,
  },
  medical_history: {
    type: Object,
  },
});
//
const Patients = mongoose.model("Patients", patientsSchema);
//
export default Patients;
