/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
import db from "../configs/db.js";
//@reference use mongoose to connect mongodb
// connect to mongodb database
async function mongooseConnection() {
  try {
    await mongoose.connect(db.url,{});
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}
//
export default mongooseConnection;
