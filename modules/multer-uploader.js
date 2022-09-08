// Setup multer (files will temporarily be saved in the "temp" folder).
const multer = require("multer");
const upload = multer({
    dest: "temp"
});

// Export the "upload"
module.exports = upload;