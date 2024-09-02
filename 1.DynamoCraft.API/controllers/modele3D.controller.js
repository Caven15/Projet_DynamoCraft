const dbConnector = require("../tools/ConnexionDb.tools").get();
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

// Ajouter des modèles 3D
exports.create = async (req, res, next) => {
    logMessage("Début de l'ajout des modèles 3D", COLOR_YELLOW);

    try {
        const { files } = req;
        const { projetId } = req.body;

        // Extraire l'utilisateur du token JWT
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const utilisateurId = decodedToken.id;

        logMessage(`ID du projet : ${projetId}`, COLOR_YELLOW);

        if (!files || files.length === 0) {
            logMessage("Aucun fichier fourni", COLOR_RED);
            return res.status(400).json({ message: "Aucun fichier fourni" });
        }

        if (files.length > 25) {
            logMessage("Limite de 25 fichiers par envoi dépassée", COLOR_RED);
            files.forEach((file) => {
                fs.unlink(file.path, (err) => {
                    if (err) console.log(err);
                });
            });
            return res.status(400).json({ message: "Limite de 25 fichiers par envoi dépassée" });
        }

        logMessage("Vérification de l'existence du projet", COLOR_YELLOW);
        const projet = await dbConnector.Projet.findByPk(projetId);
        if (!projet) {
            logMessage("Projet non trouvé", COLOR_RED);
            files.forEach((file) => {
                fs.unlink(file.path, (err) => {
                    if (err) console.log(err);
                });
            });
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        logMessage("Vérification des modèles existants", COLOR_YELLOW);
        const existingModeles = await dbConnector.Modele3D.findAll({
            where: { projetId },
        });
        const existingNoms = existingModeles.map(
            (modele) => modele.nom.split("-")[1]
        );

        const modeles3D = [];
        for (const file of files) {
            const nomPartie = file.filename.split("-")[1];

            if (existingNoms.includes(nomPartie)) {
                logMessage(
                    `Le nom de fichier "${file.filename}" est déjà présent dans le projet`,
                    COLOR_RED
                );
                files.forEach((file) => {
                    fs.unlink(file.path, (err) => {
                        if (err) console.log(err);
                    });
                });
                return res.status(400).json({
                    message: `Le nom de fichier "${file.filename}" est déjà présent dans le projet`,
                });
            }

            logMessage(`Ajout du modèle 3D : ${file.filename}`, COLOR_YELLOW);
            const newModele3D = await dbConnector.Modele3D.create({
                nom: file.filename,
                dateCreation: new Date(),
                dateModif: new Date(),
                projetId,
            });
            modeles3D.push(newModele3D);
        }

        logMessage("Modèles 3D ajoutés avec succès", COLOR_GREEN);
        res.status(201).json({
            message: "Modèles 3D ajoutés avec succès",
            modeles3D,
        });
    } catch (error) {
        logMessage("Erreur lors de l'ajout des modèles 3D", COLOR_RED);
        console.error("Erreur lors de l'ajout des modèles 3D :", error);
        res.status(500).json({
            message: "Erreur lors de l'ajout des modèles 3D",
        });
    }
};

// Récupérer tous les modèles d'un projet 3D
exports.getByProjetId = async (req, res, next) => {
    logMessage(
        "Début de la récupération des modèles 3D par ID de projet",
        COLOR_YELLOW
    );

    try {
        const { id } = req.params;
        logMessage(`ID du projet : ${id}`, COLOR_YELLOW);

        logMessage("Récupération des modèles 3D", COLOR_YELLOW);
        const modeles3D = await dbConnector.Modele3D.findAll({
            where: { projetId: id },
        });

        logMessage("Modèles 3D récupérés avec succès", COLOR_GREEN);
        res.status(200).json({ modeles3D });
    } catch (error) {
        logMessage("Erreur lors de la récupération des modèles 3D", COLOR_RED);
        console.error("Erreur lors de la récupération des modèles 3D :", error);
        res.status(500).json({
            message: "Erreur lors de la récupération des modèles 3D",
        });
    }
};

exports.updateByProjetId = async (req, res, next) => {
    logMessage("Début de la mise à jour des fichiers 3D pour un projet", COLOR_YELLOW);

    try {
        const { files } = req;
        const { id } = req.params; // ID du projet
        const modelesToRemove = req.body.modelesToDelete ? JSON.parse(req.body.modelesToDelete) : [];

        // Extraire l'utilisateur du token JWT
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const utilisateurId = decodedToken.id;

        logMessage(`ID du projet : ${id}`, COLOR_YELLOW);
        logMessage(`Modèles 3D à supprimer : ${JSON.stringify(modelesToRemove)}`, COLOR_YELLOW);

        // Vérifier si le projet existe
        logMessage("Vérification de l'existence du projet", COLOR_YELLOW);
        const projet = await dbConnector.Projet.findByPk(id);
        if (!projet) {
            logMessage("Projet non trouvé", COLOR_RED);
            if (files && files.length > 0) {
                files.forEach((file) => fs.unlink(file.path, (err) => err && console.log(err)));
            }
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        // Supprimer les anciens modèles 3D spécifiés
        if (Array.isArray(modelesToRemove) && modelesToRemove.length > 0) {
            logMessage("Suppression des anciens modèles 3D sélectionnés", COLOR_YELLOW);
            for (const modeleId of modelesToRemove) {
                const modele3D = await dbConnector.Modele3D.findByPk(modeleId);
                if (modele3D && modele3D.projetId === parseInt(id)) {
                    logMessage(`Suppression du modèle 3D ID: ${modeleId}`, COLOR_YELLOW);

                    // Supprimer le fichier du modèle 3D du système de fichiers
                    const filePath = path.join(__dirname, "../uploads/", modele3D.nom);
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            logMessage(`Erreur lors de la suppression du fichier du modèle 3D ${modeleId}`, COLOR_RED);
                            console.error(err);
                        } else {
                            logMessage(`Fichier du modèle 3D ${modele3D.nom} supprimé du système de fichiers`, COLOR_GREEN);
                        }
                    });

                    // Supprimer l'enregistrement du modèle 3D de la base de données
                    await modele3D.destroy();
                    logMessage(`Modèle 3D ID: ${modeleId} supprimé de la base de données`, COLOR_GREEN);
                } else {
                    logMessage(`Modèle 3D ID: ${modeleId} non trouvé ou ne correspond pas au projet`, COLOR_RED);
                }
            }
        }

        // Ajouter les nouveaux fichiers 3D
        if (files && files.length > 0) {
            logMessage("Ajout des nouveaux fichiers 3D", COLOR_YELLOW);
            const modeles3D = [];
            for (const file of files) {
                const newModele3D = await dbConnector.Modele3D.create({
                    nom: file.filename,
                    dateCreation: new Date(),
                    dateModif: new Date(),
                    projetId: id,
                });
                modeles3D.push(newModele3D);
            }

            logMessage("Fichiers 3D mis à jour avec succès", COLOR_GREEN);
            return res.status(200).json({
                message: "Fichiers 3D mis à jour avec succès",
                modeles3D,
            });
        }

        // Si aucune nouvelle fichier 3D n'est ajouté, retourner un message approprié
        logMessage("Opération terminée, seules les suppressions ont été effectuées", COLOR_GREEN);
        res.status(200).json({
            message: "Opération terminée avec succès, aucun nouveau modèle 3D ajouté",
        });

    } catch (error) {
        logMessage("Erreur lors de la mise à jour des fichiers 3D", COLOR_RED);
        console.error("Erreur lors de la mise à jour des fichiers 3D :", error);
        return res.status(500).json({ message: "Erreur lors de la mise à jour des fichiers 3D" });
    }
};

// Supprimer un modèle 3D par ID
exports.delete = async (req, res, next) => {
    logMessage("Début de la suppression du modèle 3D", COLOR_YELLOW);

    try {
        const { id } = req.params;
        logMessage(`ID du modèle 3D : ${id}`, COLOR_YELLOW);

        logMessage("Vérification de l'existence du modèle 3D", COLOR_YELLOW);
        const modele3D = await dbConnector.Modele3D.findByPk(id);
        if (!modele3D) {
            logMessage("Modèle 3D non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Modèle 3D non trouvé" });
        }

        // Supprimer le fichier du modèle 3D
        logMessage("Suppression du fichier du modèle 3D", COLOR_YELLOW);
        const filePath = path.join(__dirname, "../uploads/", modele3D.nom);
        fs.unlink(filePath, (err) => {
            if (err) {
                logMessage(
                    "Erreur lors de la suppression du fichier du modèle 3D",
                    COLOR_RED
                );
                console.error(
                    "Erreur lors de la suppression du fichier du modèle 3D :",
                    err
                );
            } else {
                logMessage(
                    "Fichier du modèle 3D supprimé avec succès",
                    COLOR_GREEN
                );
            }
        });

        logMessage(
            "Suppression du modèle 3D de la base de données",
            COLOR_YELLOW
        );
        await modele3D.destroy();

        logMessage("Modèle 3D supprimé avec succès", COLOR_GREEN);
        res.status(200).json({ message: "Modèle 3D supprimé avec succès" });
    } catch (error) {
        logMessage("Erreur lors de la suppression du modèle 3D", COLOR_RED);
        console.error("Erreur lors de la suppression du modèle 3D :", error);
        res.status(500).json({
            message: "Erreur lors de la suppression du modèle 3D",
        });
    }
};
