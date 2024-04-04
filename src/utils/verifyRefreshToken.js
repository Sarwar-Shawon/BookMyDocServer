/*
 * @copyRight by md sarwar hoshen.
 */
import jwt from "jsonwebtoken";
import UserToken from "../models/userToken.js";
//
const verifyRefreshToken = async (refreshToken) => {
  const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
  //
  const user = await UserToken.findOne({ token: refreshToken });
  return new Promise((resolve, reject) => {
    jwt.verify(user.token, privateKey, (err, tokenDetails) => {
      if (err) return reject({ success: false, error: "Invalid refresh token" });
      resolve({
        tokenDetails,
        success: true,
        message: "Valid refresh token",
      });
    });
  });
};
export {
  verifyRefreshToken,
};
