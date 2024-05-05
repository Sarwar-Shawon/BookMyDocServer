/*
 * @copyRight by md sarwar hoshen.
 */
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
//
const key = crypto
  .createHash("sha512")
  .update(process.env.ENCRYPTION_ALGORITHM_KEY)
  .digest("hex")
  .substring(0, 32);
const encryptionIV = crypto
  .createHash("sha512")
  .update(process.env.ENCRYPTION_ALGORITHM_IV)
  .digest("hex")
  .substring(0, 16);
//
function encryptData(data) {
  const cipher = crypto.createCipheriv(process.env.ENCRYPTION_ALGORITHM_METHOD, key, encryptionIV);
  return Buffer.from(
    cipher.update(data, "utf8", "hex") + cipher.final("hex")
  ).toString("base64");
}
//
function decryptData(encryptedData) {
  const buff = Buffer.from(encryptedData, "base64");
  const decipher = crypto.createDecipheriv(
    process.env.ENCRYPTION_ALGORITHM_METHOD,
    key,
    encryptionIV
  );
  return (
    decipher.update(buff.toString("utf8"), "hex", "utf8") +
    decipher.final("utf8")
  );
}
//
export { encryptData, decryptData };
