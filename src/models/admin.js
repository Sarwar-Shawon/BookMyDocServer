/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const adminSchema = new mongoose.Schema({
  admin_email: {
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
  img: {
    type: String,
  },
  addr:{
    type: Object,
  },
  details: {
    type: Object,
  },
});
//
const Admin = mongoose.model("Admin", adminSchema);
//
export default Admin;
