/*
 * @copyRight by md sarwar hoshen.
 */

import mongoose from "mongoose";
//
const TimeSlotSchema = new mongoose.Schema({
  timeSlots: {
    type: Object,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctors",
    unique: true
  },
  updatedAt:{
    type: String, 
    required: true,
    default: Date.now()
  },
  holidays:{
    type: Array,
    default: []
  }
});

//
const TimeSlots = mongoose.model("TimeSlots", TimeSlotSchema);
//
export default TimeSlots;
