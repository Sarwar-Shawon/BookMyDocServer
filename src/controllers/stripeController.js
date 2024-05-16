/*
 * @copyRight by md sarwar hoshen.
 */
import { getToken } from "../utils/getToken.js";
import jwt from "jsonwebtoken";
import stripe from "stripe";
import {updatePatientPrescriptionPayment,updatePatientPrescriptionRefundPayment} from '../controllers/prescriptionController.js'
const stripeInstance = stripe(process.env.STRIPE_KEY_SERVER);
import mailSender from "../services/mailSender.js";
//
const createStripeCheckout = async (req, res) => {
  const token = getToken(req.headers["authorization"]);
  const curUser = jwt.decode(token);
  if (!curUser) {
    return res.status(422).json({ success: false, error: "user not found" });
  }
  //
  const session = await stripeInstance.checkout.sessions.create({
    line_items: req.body.line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT_APP_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_APP_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
    metadata: {
        pres_id: req.body.pres_id
    }
  });
  //   res.send(303, session.url);
  res.status(200).json({
    success: true,
    data: session,
  });
};
//
const updatePatientTransactionDetails = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "user not found" });
    }
    const sessionId = req.body.sessionId;
    const transaction = await stripeInstance.checkout.sessions.retrieve(sessionId);
    //
    console.log("transactiontransactiontransaction: ", transaction)
    //
    if (transaction?.payment_intent) {
      req.transObj = {
        payment_intent: transaction.payment_intent,
        paid_amount: transaction.amount_total,
        pres_id: transaction?.metadata?.pres_id,
      };
      return await updatePatientPrescriptionPayment(req, res);
    }else{
      return res.status(400).json({
        success: false,
        error: "Payment failed",
      });
    }
    //

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch transaction details",
    });
  }
};
//
const refundAmount = async (req, res) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    const curUser = jwt.decode(token);
    if (!curUser) {
      return res.status(422).json({ success: false, error: "user not found" });
    }
    const refund = await stripeInstance.refunds.create({
      payment_intent: req.body.payment_intent,
      amount:  req.body.paid_amount,
    });
    console.log("refund",refund)
    //
    req.refund = refund
    return await updatePatientPrescriptionRefundPayment(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch transaction details",
    });
  }
};
//
export {
  //
  createStripeCheckout,
  updatePatientTransactionDetails,
  refundAmount
};
