/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const nursesSchema = new mongoose.Schema({
  nur_email: {
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
  gmc_licence: {
    type: String,
    default: "",
  },

  img: {
    type: String,
  },
  addr:{
    type: Object,
  },
  active: {
    type: Boolean,
    required: true
  },
  dept: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Departments"
  },
  organization:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizations"
  }
});
//
const Nurses = mongoose.model("Nurses", nursesSchema);
//
export default Nurses;
