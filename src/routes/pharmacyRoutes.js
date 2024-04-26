/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import {
  getPharmacyPrescriptions,
  updatePrescription,
} from "../controllers/prescriptionController.js";
import { auth, checkAuthRole } from "../middleware/auth.js";
import roles from "../helpers/roles.js";
import { upload } from "../utils/uploadImage.js";
const pharmacyRouter = express.Router();
/*
 * Profile
 */
pharmacyRouter
  .route("/get-profile")
  .get(auth, checkAuthRole([roles.Pharmacy]), getProfile);
pharmacyRouter
  .route("/update-profile")
  .put(
    auth,
    checkAuthRole([roles.Pharmacy]),
    upload.fields([{ name: "img", maxCount: 1 }]),
    updateProfile
  );
/*
 * Prescriptions
 */
pharmacyRouter
  .route("/get-prescriptions")
  .get(auth, checkAuthRole([roles.Pharmacy]), getPharmacyPrescriptions);
pharmacyRouter
  .route("/update-prescription")
  .post(auth, checkAuthRole([roles.Pharmacy]), updatePrescription);
//
export default pharmacyRouter;
