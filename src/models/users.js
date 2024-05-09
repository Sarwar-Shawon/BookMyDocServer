/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
import roles from '../helpers/roles.js'
//Users Collection
const usersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  },
  pas_cg_rq: {
    type: Boolean,
    required: true,
    default: false
  },
  user_type: {
    type: String,
    required: true,
    enum: [roles.Admin, roles.Doctor, roles.Patient, roles.Pharmacy, roles.Nurse]
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  },
  createAt:{
    type: String,
    required: true,
    default: Date.now()
  }
});
//
usersSchema.methods.toJSON = function () {
  const users = this;
  const usersObject = users.toObject();
  delete usersObject.password;
  return usersObject;
};
const Users = mongoose.model("Users", usersSchema);
//
export default Users;