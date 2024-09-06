const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("./logs.tools");

const uploadDir = "uploads/";

// Vérification et création du répertoire si nécessaire
if (!fs.existsSync(uploadDir)) {
    logMessage(
        `Le dossier ${uploadDir} n'existe pas, création en cours...`,
        COLOR_YELLOW
    );
    fs.mkdirSync(uploadDir, { recursive: true });
    logMessage(`Le dossier ${uploadDir} a été créé avec succès.`, COLOR_GREEN);
} else {
    logMessage(`Le dossier ${uploadDir} existe déjà.`, COLOR_GREEN);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        logMessage(
            `Début de la sauvegarde du fichier dans ${uploadDir}`,
            COLOR_YELLOW
        );
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        logMessage(`Nom du fichier généré : ${filename}`, COLOR_YELLOW);
        cb(null, filename);
    },
});

const allowedTypes = ["png", "jpeg", "jpg", "gif"];

const fileFilter = (req, file, cb) => {
    const fileExtension = file.originalname.split(".").pop()?.toLowerCase();
    const mimeTypeAllowed =
        file.mimetype === "image/jpeg" || file.mimetype === "image/png";

    logMessage(
        `Vérification du type de fichier : ${file.originalname} (${file.mimetype})`,
        COLOR_YELLOW
    );

    if (mimeTypeAllowed && allowedTypes.includes(fileExtension)) {
        logMessage("Type de fichier accepté.", COLOR_GREEN);
        cb(null, true);
    } else {
        logMessage("Type de fichier rejeté.", COLOR_RED);
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 20, // Limite de taille de 20MB
    },
    fileFilter: fileFilter,
});

module.exports = upload;
