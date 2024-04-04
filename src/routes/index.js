/*
 * @copyRight by md sarwar hoshen.
 */
import { Router as expressRouter } from "express";
const router = expressRouter();
//
import otpRoutes from "./otpRoutes.js";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";
import doctorRouter from "./doctorRoutes.js";
import patientRouter from "./patientRoutes.js";
import nurseRouter from "./nurseRoutes.js";
import pharmacyRouter from "./pharmacyRoutes.js";

// otp routes
router.use("/otp",  otpRoutes);
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/doctor", doctorRouter);
router.use("/patient", patientRouter);
router.use("/nurse", nurseRouter);
router.use("/pharmacy", pharmacyRouter);

//
export default router;
