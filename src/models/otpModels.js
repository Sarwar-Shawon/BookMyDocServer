/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  ct:{
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  }
});
//
const Otps = mongoose.model("otps", otpSchema);
//
export default Otps;
