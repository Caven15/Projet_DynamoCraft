const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const allowedTypes = ['png', 'jpeg', 'jpg', 'gif'];

const fileFilter = (req, file, cb) => {
    const fileExtension = file.originalname.split('.').pop()?.toLowerCase();
    const mimeTypeAllowed = file.mimetype === "image/jpeg" || file.mimetype === "image/png";

    if (mimeTypeAllowed && allowedTypes.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20, // 20MB
    },
    fileFilter: fileFilter,
});

module.exports = upload;
