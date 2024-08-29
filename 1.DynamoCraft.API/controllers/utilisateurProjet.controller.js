const dbConnector = require("../tools/ConnexionDb.tools").get();
const { createZip, getProjectFileNames } = require("../tools/zipConfig.tools");
const path = require("path");
const fs = require("fs");
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

exports.downloadProjet = async (req, res, next) => {
    logMessage("Début du téléchargement du projet", COLOR_YELLOW);

    try {
        const { projetId } = req.params;
        const utilisateurId = req.query.utilisateurId;

        // Vérification de l'existence de l'utilisateurId
        if (!utilisateurId) {
            logMessage("ID utilisateur non fourni", COLOR_RED);
            return res.status(400).json({ message: "ID utilisateur non fourni" });
        }

        // Récupérer le projet depuis la base de données avec l'utilisateur associé
        logMessage(`Récupération du projet avec ID: ${projetId}`, COLOR_YELLOW);
        const projet = await dbConnector.Projet.findByPk(projetId, {
            include: [
                { model: dbConnector.Utilisateur, as: 'utilisateur', attributes: ["pseudo"] },
                { model: dbConnector.ImageProjet, as: 'imageProjet', attributes: ["nom"] },
                { model: dbConnector.Modele3D, attributes: ["nom"] },
            ],
        });

        if (!projet) {
            logMessage("Projet non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        // Récupérer les noms des fichiers associés au projet
        logMessage("Récupération des noms des fichiers associés au projet", COLOR_YELLOW);
        const allFileNames = getProjectFileNames(projet);

        // Chemin du dossier temporaire pour stocker le fichier ZIP
        const tempDir = path.join(__dirname, "..", "temp");

        // Créer le répertoire temporaire s'il n'existe pas
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // Récupérer les chemins complets des fichiers dans le dossier d'upload
        const filePaths = allFileNames.map((fileName) =>
            path.join(__dirname, "..", "uploads", fileName)
        );

        // Vérifier s'il y a des fichiers à compresser
        if (filePaths.length === 0) {
            logMessage("Aucun fichier à compresser", COLOR_RED);
            return res
                .status(404)
                .json({ message: "Aucun fichier à compresser" });
        }

        // Créer le fichier ZIP avec le nom du projet et le pseudo du propriétaire
        logMessage("Création du fichier ZIP", COLOR_YELLOW);
        const zipFilePath = await createZip(
            tempDir,
            projet.nom,
            filePaths,
            projet.utilisateur.pseudo
        );

        // Incrémenter le nombre de téléchargements dans la table des statistiques
        logMessage("Incrémentation du nombre de téléchargements", COLOR_YELLOW);
        await dbConnector.Statistique.increment("nombreTelechargement", {
            where: { id: projet.statistiqueId },
        });

        // Ajouter une entrée dans la table UtilisateurProjet
        logMessage("Ajout d'une entrée dans la table utilisateurProjet", COLOR_YELLOW);
        await dbConnector.UtilisateurProjet.create({
            dateTelechargement: new Date(),
            utilisateurId: utilisateurId, // Utilisez l'ID de l'utilisateur connecté
            projetId: projetId,
        });

        // Envoyer le fichier ZIP en réponse
        res.download(zipFilePath, (err) => {
            if (err) {
                next(err);
            } else {
                logMessage("Fichier ZIP téléchargé avec succès", COLOR_GREEN);
                // Supprimer le fichier ZIP après qu'il a été envoyé
                fs.unlink(zipFilePath, (err) => {
                    if (err) {
                        logMessage(
                            "Erreur lors de la suppression du fichier ZIP",
                            COLOR_RED
                        );
                        console.error(
                            "Erreur lors de la suppression du fichier ZIP :",
                            err
                        );
                    }
                });
            }
        });
    } catch (error) {
        logMessage("Erreur lors de la création du fichier ZIP", COLOR_RED);
        console.error("Erreur lors de la création du fichier ZIP :", error);
        res.status(500).json({
            message: "Erreur lors de la création du fichier ZIP",
        });
    }
};

// Supprimer une entrée de la table UtilisateurProjet par utilisateurId et projetId
exports.deleteUtilisateurProjet = async (req, res, next) => {
    try {
        const { utilisateurId, projetId } = req.params;

        // Log pour début de la suppression
        logMessage(
            `Début de la suppression de l'entrée UtilisateurProjet pour utilisateurId: ${utilisateurId} et projetId: ${projetId}`,
            COLOR_YELLOW
        );

        // Rechercher l'entrée dans la table UtilisateurProjet
        const utilisateurProjet = await dbConnector.UtilisateurProjet.findOne({
            where: {
                utilisateurId: utilisateurId,
                projetId: projetId,
            },
        });

        // Vérification si l'entrée existe
        if (!utilisateurProjet) {
            logMessage(
                `Aucune entrée trouvée pour utilisateurId: ${utilisateurId} et projetId: ${projetId}`,
                COLOR_RED
            );
            return res.status(404).json({ message: "Entrée non trouvée dans UtilisateurProjet" });
        }

        // Supprimer l'entrée
        await utilisateurProjet.destroy();

        logMessage(
            `L'entrée UtilisateurProjet pour utilisateurId: ${utilisateurId} et projetId: ${projetId} a été supprimée avec succès`,
            COLOR_GREEN
        );
        return res.status(200).json({ message: "Entrée supprimée avec succès" });
    } catch (error) {
        logMessage(
            `Erreur lors de la suppression de l'entrée UtilisateurProjet : ${error.message}`,
            COLOR_RED
        );
        return res.status(500).json({ message: "Erreur lors de la suppression de l'entrée UtilisateurProjet." });
    }
};