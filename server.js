/*
 * @copyRight by md sarwar hoshen.
 */
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import staticMiddleware from "express-static";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("__dirname::",__dirname);
//
const app = express();
dotenv.config();
import mongoConnection from "./src/helpers/database-connection.js";
import appRoutes from "./src/routes/index.js";
import bodyParser from "body-parser";
//

app.use('/bookMyDoc/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  cors({
    origin: process.env.CLIENT_APP_URL,
    methods: ["GET", "POST", "DELETE" , "PUT"], 
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

//
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app routes
app.use(express.json());
app.use("/bookMyDoc", appRoutes);
app.use("/hello", (req,res)=>{
  res.send("hello!");
});
//
app.use((_, res) => {
  res.send({
    error: "Not found!",
  });
});
//
mongoConnection();
//
app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
