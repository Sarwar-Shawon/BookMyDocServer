/*
 * @copyRight by md sarwar hoshen.
 */
import multer from "multer";
// import path from 'path';

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     console.log("req", req, file);
//     cb(null, path.join(__dirname, "uploads"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });
// //
// const upload = multer({ storage });
const upload = multer({ dest: 'uploads'})

// //
export { upload }
