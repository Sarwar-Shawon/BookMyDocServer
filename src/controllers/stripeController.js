/*
 * @copyRight by md sarwar hoshen.
 */
import { getToken } from "../utils/getToken.js";
import jwt from "jsonwebtoken";
import stripe from "stripe";
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
    cancel_url: `${process.env.CLIENT_APP_URL}/checkout-cancel`,
  });
  //   res.send(303, session.url);
  res.status(200).json({
    success: true,
    data: session,
  });
};
//
const getTransactionDetails = async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
    const transactionDetails = {
      id: session.id,
      amount: session.amount_total,
    };
    res.status(200).json({
      success: true,
      data: transactionDetails,
    });
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
  getTransactionDetails
};
