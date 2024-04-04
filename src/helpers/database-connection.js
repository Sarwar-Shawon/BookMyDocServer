/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
import db from "../configs/db.js";
//
async function mongooseConnection() {
  try {
    await mongoose.connect(db.url,{
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('Successfully connected to database');
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}
//
export default mongooseConnection;
