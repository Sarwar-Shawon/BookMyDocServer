/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import { createStripeCheckout,getTransactionDetails } from "../controllers/stripeController.js";
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
  .route("/transaction-details")
  .get(auth, checkAuthRole([roles.Patient]), getTransactionDetails);
//
export default stripeRouter;
