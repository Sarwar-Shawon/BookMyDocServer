/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const medicineSchema = new mongoose.Schema({
  brandName: {
    type: String,
    trim: true,
    required: true,
  },
  companyName: {
    type: String,
    trim: true,
  },
  genericName: {
    type: String,
    trim: true,
    required: true,
  },

  strength: {
    type: String,
    trim: true,
  },

  type: {
    type: String,
    trim: true,
  },
});
//
const Medicines = mongoose.model("medicines", medicineSchema);
//
export default Medicines;