const dbConnector = require("../tools/ConnexionDb.tools").get();
const path = require("path");
const fs = require("fs");
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

// Ajouter une image utilisateur
exports.addImage = async (req, res, next) => {
    logMessage("Début de l'ajout de l'image utilisateur", COLOR_YELLOW);

    try {
        const { file } = req;
        const { id } = req.params;
        logMessage(`ID de l'utilisateur : ${id}`, COLOR_YELLOW);

        if (!file) {
            logMessage("Aucun fichier fourni", COLOR_RED);
            return res.status(400).json({ message: "Aucun fichier fourni" });
        }

        logMessage(
            "Vérification de l'existence de l'utilisateur",
            COLOR_YELLOW
        );
        const utilisateur = await dbConnector.Utilisateur.findByPk(id);
        if (!utilisateur) {
            logMessage("Utilisateur non trouvé", COLOR_RED);
            fs.unlink(`./uploads/${file.filename}`, (err) => {
                if (err) console.log(err);
            });
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        logMessage(
            "Vérification de l'existence d'une image utilisateur",
            COLOR_YELLOW
        );
        const existingImage = await dbConnector.ImageUtilisateur.findOne({
            where: { utilisateurId: id },
        });
        if (existingImage) {
            logMessage("Une image existe déjà pour cet utilisateur", COLOR_RED);
            fs.unlink(`./uploads/${file.filename}`, (err) => {
                if (err) console.log(err);
            });
            return res.status(400).json({
                message: "Une image existe déjà pour cet utilisateur",
            });
        }

        logMessage("Ajout de la nouvelle image utilisateur", COLOR_YELLOW);
        const newImageUtilisateur = await dbConnector.ImageUtilisateur.create({
            nom: file.filename,
            dateAjout: new Date(),
            dateModif: new Date(),
            utilisateurId: id,
        });

        logMessage(
            "Mise à jour de l'utilisateur avec l'ID de l'image",
            COLOR_YELLOW
        );
        await utilisateur.update({ imageId: newImageUtilisateur.id });

        logMessage("Image utilisateur ajoutée avec succès", COLOR_GREEN);
        res.status(201).json({
            message: "Image utilisateur ajoutée avec succès",
            image: newImageUtilisateur,
        });
    } catch (error) {
        logMessage("Erreur lors de l'ajout de l'image utilisateur", COLOR_RED);
        console.error("Erreur lors de l'ajout de l'image utilisateur :", error);
        res.status(500).json({
            message: "Erreur lors de l'ajout de l'image utilisateur",
        });
    }
};

// Mettre à jour une image utilisateur par ID d'utilisateur
exports.updateImage = async (req, res, next) => {
    logMessage("Début de la mise à jour de l'image utilisateur", COLOR_YELLOW);

    try {
        const { file } = req;
        const { id } = req.params;
        logMessage(`ID de l'utilisateur : ${id}`, COLOR_YELLOW);

        if (!file) {
            logMessage("Aucun fichier fourni", COLOR_RED);
            return res.status(400).json({ message: "Aucun fichier fourni" });
        }

        logMessage(
            "Vérification de l'existence de l'utilisateur",
            COLOR_YELLOW
        );
        const utilisateur = await dbConnector.Utilisateur.findByPk(id);
        if (!utilisateur) {
            logMessage("Utilisateur non trouvé", COLOR_RED);
            fs.unlink(`./uploads/${file.filename}`, (err) => {
                if (err) console.log(err);
            });
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        logMessage(
            "Vérification de l'existence de l'image utilisateur",
            COLOR_YELLOW
        );
        const imageUtilisateur = await dbConnector.ImageUtilisateur.findOne({
            where: { utilisateurId: id },
        });
        if (!imageUtilisateur) {
            logMessage("Image utilisateur non trouvée", COLOR_RED);
            fs.unlink(`./uploads/${file.filename}`, (err) => {
                if (err) console.log(err);
            });
            return res
                .status(404)
                .json({ message: "Image utilisateur non trouvée" });
        }

        logMessage("Suppression de l'ancienne image utilisateur", COLOR_YELLOW);
        const oldImagePath = path.join(
            __dirname,
            "../uploads/",
            imageUtilisateur.nom
        );
        fs.unlink(oldImagePath, (err) => {
            if (err)
                console.log(
                    "Erreur lors de la suppression de l'ancienne image:",
                    err
                );
        });

        logMessage(
            "Mise à jour de l'image utilisateur avec la nouvelle image",
            COLOR_YELLOW
        );
        await imageUtilisateur.update({
            nom: file.filename,
            dateModif: new Date(),
        });

        logMessage("Image utilisateur mise à jour avec succès", COLOR_GREEN);
        res.status(200).json({
            message: "Image utilisateur mise à jour avec succès",
            image: imageUtilisateur,
        });
    } catch (error) {
        logMessage(
            "Erreur lors de la mise à jour de l'image utilisateur",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la mise à jour de l'image utilisateur :",
            error
        );
        res.status(500).json({
            message: "Erreur lors de la mise à jour de l'image utilisateur",
        });
    }
};

// Supprimer une image utilisateur par ID
exports.deleteImage = async (req, res, next) => {
    logMessage("Début de la suppression de l'image utilisateur", COLOR_YELLOW);

    try {
        const { id } = req.params;
        logMessage(`ID de l'utilisateur : ${id}`, COLOR_YELLOW);

        logMessage(
            "Vérification de l'existence de l'utilisateur",
            COLOR_YELLOW
        );
        const utilisateur = await dbConnector.Utilisateur.findByPk(id);
        if (!utilisateur) {
            logMessage("Utilisateur non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        logMessage(
            "Vérification de l'existence de l'image utilisateur",
            COLOR_YELLOW
        );
        const imageUtilisateur = await dbConnector.ImageUtilisateur.findOne({
            where: { utilisateurId: id },
        });
        if (!imageUtilisateur) {
            logMessage("Image utilisateur non trouvée", COLOR_RED);
            return res
                .status(404)
                .json({ message: "Image utilisateur non trouvée" });
        }

        logMessage("Suppression du fichier d'image", COLOR_YELLOW);
        const imagePath = path.join(
            __dirname,
            "../uploads/",
            imageUtilisateur.nom
        );
        fs.unlink(imagePath, (err) => {
            if (err) {
                logMessage(
                    "Erreur lors de la suppression de l'image",
                    COLOR_RED
                );
                console.log("Erreur lors de la suppression de l'image :", err);
            }
        });

        logMessage(
            "Suppression de l'image utilisateur de la base de données",
            COLOR_YELLOW
        );
        await imageUtilisateur.destroy();

        logMessage("Image utilisateur supprimée avec succès", COLOR_GREEN);
        res.status(200).json({
            message: "Image utilisateur supprimée avec succès",
        });
    } catch (error) {
        logMessage(
            "Erreur lors de la suppression de l'image utilisateur",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la suppression de l'image utilisateur :",
            error
        );
        res.status(500).json({
            message: "Erreur lors de la suppression de l'image utilisateur",
        });
    }
};
