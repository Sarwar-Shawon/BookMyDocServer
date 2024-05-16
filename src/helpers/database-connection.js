/*
 * @copyRight by md sarwar hoshen.
 */
import mongoose from "mongoose";
import db from "../configs/db.js";
import Users from "../models/users.js"
//@reference use mongoose to connect mongodb
// connect to mongodb database
async function mongooseConnection() {
  try {
    await mongoose.connect(db.url,{});
    /* this code is written to create an admin so that 
    whoever wants to test this app can use the dummy credential
    when they setup mongodb locally.*/
    if (process.env.SERVER_STAGE === "TEST") {
      const existingUser = await Users.findOne({
        email: "admin@bookmydoctor.com",
      });
      if (!existingUser) {
        const dummyUser = new Users({
          email: "admin@bookmydoctor.com",
          password: process.env.ADMIN_PASSWORD,
          pas_cg_rq: false,
          user_type: "Admin",
          isVerified: true,
        });
        await dummyUser.save();
        console.log("Admin user created");
      } else {
        console.log("Admin user already exists");
      }
      /*The avobe code is for only testing purpose.*/
    }


  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
}
//
export default mongooseConnection;
