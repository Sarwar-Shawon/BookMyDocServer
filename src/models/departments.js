/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  details: {
    type: String,
    default: "",
  },
  img: {
    type: String,
  },
  doc_cnt:{
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    // required: true
  },
});
//
const Departments = mongoose.model("Departments", departmentSchema);
//
export default Departments;
