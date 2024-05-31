const multer = require('multer');
const path = require('path');

// Liste des extensions de fichiers 3D acceptées
const allowedExtensions = ['.stl', '.obj', '.amf', '.3mf', '.ply', '.step', '.fbx', '.iges', '.x3d'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50 // 50MB
    },
    fileFilter: fileFilter
});

module.exports = upload;