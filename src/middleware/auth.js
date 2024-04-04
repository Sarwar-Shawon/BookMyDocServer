/*
 * @copyRight by md sarwar hoshen.
 */
import jwt from "jsonwebtoken";
import {getToken} from "../utils/getToken.js";
// import roles from "../helpers/roles.js";

//
const auth = async (req, res, next) => {
  const accessToken = getToken(req.headers["authorization"]);
  //
  const refreshToken = req.cookies["_aprt"];
  if (!accessToken || !refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }
  try {
    const tokenDetails = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req.user = tokenDetails;
    next();
  } catch (err) {
    // console.log(err);
    res.status(403).json({
      success: false,
      error: "Access Denied: Invalid token",
    });
  }
};
//
const checkAuthRole = (UserRoles) => async (req, res, next) => {
  try {
    //
    const token = getToken(req.headers["authorization"]);
    //
    const user = jwt.decode(
      token
    );
    // console.log("useruseruseruser:::", user);
    //
    let { roles } = user;
    if (!roles) throw "Access Denied: Invalid user";
    !UserRoles.includes(roles)
      ? res.status(401).json({
          success: false,
          error: "Sorry you do not have access to this route",
        })
      : next();
  } catch (err) {
    // console.log(err);
    res.status(403).json({
      success: false,
      error: "Access Denied: Invalid user",
    });
  }
};
//
export { auth, checkAuthRole };
