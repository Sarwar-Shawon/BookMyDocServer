/*
 * @copyRight by md sarwar hoshen.
 */

import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
//
const mailSender = async (obj) => {
  try {
    //
    let transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      // secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    //
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: obj.to,
      subject: obj.subject,
      html: obj.body,
    });

  } catch (error) {
    console.log("src/services/mailSender.js: err: ", error.message);
    throw error;
    
  }
};
//
export default mailSender;
