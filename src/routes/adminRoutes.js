/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import {
  registerNewDoctror,
  getAllDoctors,
  updadteDoctor,
  //
  registerNewNurse,
  updadteNurse,
  getAllNurses,
  //
  registerNewPharmacy,
  updadtePharmacy,
  getAllPharmacies,
} from "../controllers/adminController.js";
import {
  createOrganization,
  getOrganizations,
  updadteOrganization
} from "../controllers/organizationController.js";
import {
  createDepartment,
  getDepartments,
  updadteDepartment,
} from "../controllers/departmentController.js";
//validator
import {
  doctorRegisterValidator,
  nurseRegisterValidator
} from "../Validator/adminControllerValidator.js";
import {
  getProfile
} from "../controllers/profileController.js";
//authurization check
import { auth, checkAuthRole } from "../middleware/auth.js";
import roles from '../helpers/roles.js'
import { upload } from "../utils/uploadImage.js";

const adminRouter = express.Router();
//
adminRouter
  .route("/registerDoctor")
  .post( doctorRegisterValidator , auth , checkAuthRole([roles.Admin]) , upload.single("img") ,registerNewDoctror);
adminRouter
  .route("/getAllDoctors")
  .get(auth , checkAuthRole([roles.Admin,]) , getAllDoctors);
adminRouter
  .route("/updateDoctor")
  .put( auth, checkAuthRole([roles.Admin, roles.Doctor]), upload.single("img"), updadteDoctor);
//
adminRouter
  .route("/registerNurse")
  .post( nurseRegisterValidator, auth , checkAuthRole([roles.Admin]) , upload.single("img"), registerNewNurse);
adminRouter
  .route("/updateNurse")
  .put( auth, checkAuthRole([roles.Admin , roles.Nurse]) , upload.single("img") ,  updadteNurse, );
adminRouter
  .route("/getAllNurses")
  .get( auth, checkAuthRole([roles.Admin]) , getAllNurses);
//
adminRouter
  .route("/registerPharmacy")
  .post( auth,checkAuthRole([roles.Admin]), upload.single("img") , registerNewPharmacy);
adminRouter
  .route("/updatePharmacy")
  .put( auth, checkAuthRole([roles.Admin , roles.Pharmacy]) , upload.single("img") , updadtePharmacy);
adminRouter
  .route("/getAllPharmacies")
  .get( auth,checkAuthRole([roles.Admin]) , getAllPharmacies);
//department
adminRouter
  .route("/createDepartment")
  .post(  auth , checkAuthRole([roles.Admin]) , upload.single("img") ,createDepartment);
adminRouter
  .route("/getAllDepartments")
  .get(auth , checkAuthRole([roles.Admin, roles.Doctor, roles.Patient ,  roles.Nurse]) , getDepartments);
adminRouter
  .route("/updadteDepartment")
  .put( auth, checkAuthRole([roles.Admin]), upload.single("img"), updadteDepartment);
//organization
adminRouter
  .route("/createOrganization")
  .post(  auth , checkAuthRole([roles.Admin]) , upload.single("img") ,createOrganization);
adminRouter
  .route("/getAllOrganizations")
  .get(auth , checkAuthRole([roles.Admin]) , getOrganizations);
adminRouter
  .route("/updadteOrganization")
  .put( auth, checkAuthRole([roles.Admin]), upload.single("img"), updadteOrganization);
adminRouter
  .route("/get-profile")
  .get( auth, checkAuthRole([roles.Admin]), getProfile);
//
export default adminRouter;
