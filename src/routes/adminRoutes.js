/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import {
  registerNewDoctror,
  getAllDoctors,
  updadteDoctor,
  deleteDoctor,
  //
  registerNewNurse,
  updadteNurse,
  deleteNurse,
  getAllNurses,
  getAllNursesByDeptAndOrg,
  //
  registerNewPharmacy,
  updadtePharmacy,
  deletePharmacy,
  getAllPharmacies,
} from "../controllers/adminController.js";
import {
  createOrganization,
  getOrganizations,
  updadteOrganization,
} from "../controllers/organizationController.js";
import {
  createDepartment,
  getDepartments,
  updadteDepartment,
} from "../controllers/departmentController.js";
//validator
import {
  doctorRegisterValidator,
  nurseRegisterValidator,
  pharmacyRegisterValidator,
} from "../Validator/adminControllerValidator.js";
import { getProfile } from "../controllers/profileController.js";
//authurization check
import { auth, checkAuthRole } from "../middleware/auth.js";
import roles from "../helpers/roles.js";
import { upload } from "../utils/uploadImage.js";
import { validateReq } from "../middleware/validateMiddleware.js";
const adminRouter = express.Router();
//
adminRouter
  .route("/registerDoctor")
  .post(
    auth,
    checkAuthRole([roles.Admin]),
    upload.single("img"),
    doctorRegisterValidator,
    validateReq,
    registerNewDoctror
  );
adminRouter
  .route("/getAllDoctors")
  .get(auth, checkAuthRole([roles.Admin]), getAllDoctors);
adminRouter
  .route("/updateDoctor")
  .put(
    auth,
    checkAuthRole([roles.Admin, roles.Doctor]),
    upload.single("img"),
    updadteDoctor
  );
adminRouter
  .route("/deleteDoctor")
  .delete(auth, checkAuthRole([roles.Admin, roles.Doctor]), deleteDoctor);
adminRouter
  .route("/deleteNurse")
  .delete(auth, checkAuthRole([roles.Admin]), deleteNurse);
//
adminRouter
  .route("/registerNurse")
  .post(
    auth,
    checkAuthRole([roles.Admin]),
    upload.single("img"),
    nurseRegisterValidator,
    validateReq,
    registerNewNurse
  );
adminRouter
  .route("/updateNurse")
  .put(
    auth,
    checkAuthRole([roles.Admin, roles.Nurse]),
    upload.single("img"),
    updadteNurse
  );

adminRouter
  .route("/getAllNurses")
  .get(auth, checkAuthRole([roles.Admin]), getAllNurses);
adminRouter
  .route("/getAllNursesByDeptOrg")
  .get(auth, checkAuthRole([roles.Admin]), getAllNursesByDeptAndOrg);
//
adminRouter
  .route("/registerPharmacy")
  .post(
    auth,
    checkAuthRole([roles.Admin]),
    upload.single("img"),
    pharmacyRegisterValidator,
    validateReq,
    registerNewPharmacy
  );
adminRouter
  .route("/updatePharmacy")
  .put(
    auth,
    checkAuthRole([roles.Admin, roles.Pharmacy]),
    upload.single("img"),
    updadtePharmacy
  );
adminRouter
  .route("/deletePharmacy")
  .delete(auth, checkAuthRole([roles.Admin]), deletePharmacy);
adminRouter
  .route("/getAllPharmacies")
  .get(auth, checkAuthRole([roles.Admin]), getAllPharmacies);
//department
adminRouter
  .route("/createDepartment")
  .post(
    auth,
    checkAuthRole([roles.Admin]),
    upload.single("img"),
    createDepartment
  );
adminRouter
  .route("/getAllDepartments")
  .get(
    auth,
    checkAuthRole([roles.Admin, roles.Doctor, roles.Patient, roles.Nurse]),
    getDepartments
  );
adminRouter
  .route("/updadteDepartment")
  .put(
    auth,
    checkAuthRole([roles.Admin]),
    upload.single("img"),
    updadteDepartment
  );
//organization
adminRouter
  .route("/createOrganization")
  .post(
    auth,
    checkAuthRole([roles.Admin]),
    upload.single("img"),
    createOrganization
  );
adminRouter
  .route("/getAllOrganizations")
  .get(auth, checkAuthRole([roles.Admin]), getOrganizations);
adminRouter
  .route("/updadteOrganization")
  .put(
    auth,
    checkAuthRole([roles.Admin]),
    upload.single("img"),
    updadteOrganization
  );
adminRouter
  .route("/get-profile")
  .get(auth, checkAuthRole([roles.Admin]), getProfile);
//
export default adminRouter;
