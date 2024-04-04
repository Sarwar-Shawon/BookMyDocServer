/*
 * @copyRight by md sarwar hoshen.
 */

import Otps from "../models/otpModels.js";
import randomstring from "randomstring";
import mailSender from "../services/mailSender.js";

// Send OTP to the email
const sendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = randomstring.generate({
            length: 6,
            charset: 'numeric'
        });
        // const newOTP = new Otps({ email:'sshawon95@gmail.com', otp , ct: Date.now()});
        // //save otp to database
        // await newOTP.save();
        // Send otp
        await mailSender({
            to: 'sshawon95@gmail.com',
            subject: 'Confirmation OTP',
            body: `<p>To complete your registration Please enter this OTP : <strong>${otp}</strong></p>`,
        });
        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
// Verify OTP provided by the user
const verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.query;
        const findOtp = await Otps.findOneAndDelete({ email, otp });
        if (findOtp) {
            res.status(200).json({ success: true, message: 'OTP verification successful' });
        } else {
            res.status(400).json({ success: false, error: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
//
export { sendOTP, verifyOTP}