/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    unique: true,
  },
  email: {
    type: String,
    default: "",
    unique: true,
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
    required: true
  },
  active: {
    type: Boolean,
  }
});
//
const Organizations = mongoose.model("Organizations", organizationSchema);
//
export default Organizations;
