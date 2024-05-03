/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
//
const prescriptionsSchema = new mongoose.Schema({
  pt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patients",
    required: true,
  },
  doc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctors",
    required: true,
  },
  phar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacies",
  },
  apt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointments",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updateDt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    default: "New",
    enum: ["New", "Ready", "Dispensed"],
    required: true,
  },
  medications: [],
  validDt: {
    type: Date,
  },
  nshId: {
    type: String,
    required: true,
  },
  payStatus: {
    type: String,
    default: "Unpaid",
    enum: ["Unpaid", "Paid"],
    required: true,
  },
  paidBy: {
    type: String,
    enum: ["Cash", "Card"],
  },
  amount: {
    type: String,
  },
  repeatReq: {
    type: Boolean,
    default: false,
  },
  opid: {
    type: mongoose.Schema.Types.ObjectId,
  },
  repeatOption: {
    type: Boolean,
    default: false,
  },
  repeatPresDt: {
    type: Date,
  },
  repeatReqDt: {
    type: Date,
  },
  dispensedDt: {
    type: Date,
  },
  presType: {
    type: String,
    enum: ["New", "Repeated"],
    required: true,
  },
  rpid: {
    type: mongoose.Schema.Types.ObjectId,
  },
  transObj: {
    type: Object,
  }
});
//
const Prescriptions = mongoose.model("Prescriptions", prescriptionsSchema);
//
export default Prescriptions;
