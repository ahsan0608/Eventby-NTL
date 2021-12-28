const util = require("util");
const multer = require("multer");
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// for single file upload
let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("myImage");
const uploadSingleFile = util.promisify(uploadFile);

// for multiple file upload
let uploadFiles = multer({ storage: storage }).array("myImage", 12);
const uploadMultipleFiles = util.promisify(uploadFiles);

module.exports = { uploadSingleFile, uploadMultipleFiles };
