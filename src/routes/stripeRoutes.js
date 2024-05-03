/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import { createStripeCheckout,updatePatientTransactionDetails } from "../controllers/stripeController.js";
import { auth, checkAuthRole } from "../middleware/auth.js";
import roles from "../helpers/roles.js";
const stripeRouter = express.Router();
/*
 * Payment
 */
stripeRouter
  .route("/make-payment")
  .post(auth, checkAuthRole([roles.Patient]), createStripeCheckout);
stripeRouter
  .route("/update-transaction-details")
  .post(auth, checkAuthRole([roles.Patient]), updatePatientTransactionDetails);
//
export default stripeRouter;
