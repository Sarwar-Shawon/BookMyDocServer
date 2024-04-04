/*
 * @copyRight by md sarwar hoshen.
 */
import dotenv from "dotenv"
dotenv.config();
const db = {
  url: process.env.MONGO_URL,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
};
//
export default db;
