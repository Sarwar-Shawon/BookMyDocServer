/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const pharmaciesSchema = new mongoose.Schema({
  phar_email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  name: {
    type: String,
    default: "",
    required: true,
  },
  phone: {
    type: String,
    default: "",
  },
  licence: {
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
  org:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizations",
    required: true
  },
});
//
const Pharmacies = mongoose.model("Pharmacies", pharmaciesSchema);
//
export default Pharmacies;
