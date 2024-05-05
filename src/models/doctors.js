/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const doctorsSchema = new mongoose.Schema({
  doc_email: {
    type: String,
    required: true,
    unique: true,
    
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
  gmc_licence: {
    type: String,
    default: "",
  },
  img: {
    type: String,
  },
  pSign: {
    type: String,
  },
  addr:{
    type: Object,
  },
  details: {
    type: Object,
  },
  active: {
    type: Boolean,  
    // required: true
  },
  dept: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments",
    required: true
  },
  organization:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizations",
    required: true
  },
  nurses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nurses",
  }],
});
//
const Doctors = mongoose.model("Doctors", doctorsSchema);
//
export default Doctors;
