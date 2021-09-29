const multer = require('multer');
const path = require('path');

const storageFiles = multer.diskStorage({
    destination: "./uploads/files/",

    filename: function (req, file, cb) {
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    },
});


const upload = multer({
    storage: storageFiles,
    limits: {
        fileSize: 1000000*10,
    }
});


module.exports = upload;