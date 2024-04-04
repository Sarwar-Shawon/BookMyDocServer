/*
 * @copyRight by md sarwar hoshen.
 */
import jwt from "jsonwebtoken";
import UserToken from "../models/userToken.js";
import dotenv from "dotenv"
dotenv.config();
//
const generateTokens = async (user) => {

  try {
    const payload = { _id: user._id, roles: user.user_type , email: user.email };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY,
      { expiresIn: process.env.ACCESS_TOKEN_LIFE }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY,
      { expiresIn: process.env.REFRESH_TOKEN_LIFE }
    );
    //
    const userToken = await UserToken.findOne({ userId: user._id });
    if (userToken) await userToken.deleteOne();
    //
    await new UserToken({ userId: user._id, token: refreshToken }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};
//
export{
  generateTokens,
};
