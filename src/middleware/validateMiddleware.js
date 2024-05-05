/*
 * @copyRight by md sarwar hoshen.
 */
import { validationResult } from "express-validator";
// Validation middleware
const validateReq = (req, res, next) => {
  const errors = validationResult(req);
  //error handle
  if (!errors.isEmpty()) {
    let err_msg = "";
    errors.array().map((item, index) => {
      err_msg += item.msg;
      if (index != errors.array().length - 1) err_msg += "\n";
    });
    return res.status(400).json({ success: false, error: err_msg });
  }
  next();
};
//
export {validateReq};
