/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const medicineSchema = new mongoose.Schema({
  brandName: {
    type: String,
    trim: true
  },
  genericName: {
    type: String,
    trim: true,
    required: true,
  },
  dose: {
    type: Array,
  },
  type: {
    type: Array,
    trim: true,
  },
});
//
const Medicines = mongoose.model("medicines", medicineSchema);
//
export default Medicines;