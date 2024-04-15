/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const medicineSchema = new mongoose.Schema({
  genericName: {
    type: String,
    trim: true,
    required: true,
  },
  strength: {
    type: Object,
  },
  type: {
    type: Array,
  },
});
//
const Medicines = mongoose.model("medicines", medicineSchema);
//
export default Medicines;