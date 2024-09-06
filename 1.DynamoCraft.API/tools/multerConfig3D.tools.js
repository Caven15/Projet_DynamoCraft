const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Liste des extensions de fichiers 3D acceptées
const allowedExtensions = [
    ".stl",
    // ".obj",
    // ".amf",
    // ".3mf",
    // ".ply",
    // ".step",
    // ".fbx",
    // ".iges",
    // ".x3d",
];

// Chemin du répertoire des fichiers d'uploads
const uploadDir = "uploads/";

// Vérifier si le répertoire 'uploads' existe, sinon le créer
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Création récursive du répertoire
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Définir le répertoire de destination
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Nommer les fichiers avec un timestamp
    },
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true); // Accepter le fichier si l'extension est autorisée
    } else {
        cb(null, false); // Rejeter le fichier sinon
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 50, // Limite de 50MB pour les fichiers
    },
    fileFilter: fileFilter,
});

module.exports = upload;
