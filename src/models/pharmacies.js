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
  },
  name: {
    type: String,
    default: "",
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
  details: {
    type: Object,
  },
  active: {
    type: Boolean,
    required: true
  }
});
//
const Pharmacies = mongoose.model("Pharmacies", pharmaciesSchema);
//
export default Pharmacies;
