const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// env config
require('dotenv').config();
//configure cloudinary
cloudinary.config({
  cloud_name: process.env.Cloudinary_name,
  api_key: process.env.Cloudinary_api,
  api_secret: process.env.Cloudinary_apiSecret,
});

// //configure cloudinary storage
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: "wal",
//     public_id: (req, file) => Date.now() + "-instagram",
//   },
// });

//export storage
module.exports = cloudinary;