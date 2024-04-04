/*
 * @copyRight by md sarwar hoshen.
 */
import bcrypt from "bcrypt";
//hash password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  return await bcrypt.hash(password, salt);
}
// compare password
async function comparePassword(password, hash_password) {
  try {
    return await bcrypt.compare(password, hash_password);
  } catch (err) {
    throw err;
  }
}
//
export {
  hashPassword,
  comparePassword,
};
