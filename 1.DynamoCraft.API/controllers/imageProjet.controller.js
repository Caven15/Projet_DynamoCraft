const dbConnector = require("../tools/ConnexionDb.tools").get();
const path = require("path");
const fs = require("fs");
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

// Créer des images pour un projet
exports.create = async (req, res, next) => {
    logMessage("Début de l'ajout des images projet", COLOR_YELLOW);

    try {
        const { files } = req;
        const { id } = req.params;
        logMessage(`ID du projet : ${id}`, COLOR_YELLOW);

        if (!files || files.length === 0) {
            logMessage("Aucun fichier fourni", COLOR_RED);
            return res.status(400).json({ message: "Aucun fichier fourni" });
        }

        logMessage("Vérification de l'existence du projet", COLOR_YELLOW);
        const projet = await dbConnector.Projet.findByPk(id);
        if (!projet) {
            logMessage("Projet non trouvé", COLOR_RED);
            // Supprimer les fichiers téléchargés en cas d'erreur
            files.forEach((file) => {
                fs.unlink(file.path, (err) => {
                    if (err) console.log(err);
                });
            });
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        logMessage(
            "Vérification du nombre d'images existantes pour le projet",
            COLOR_YELLOW
        );
        const existingImages = await dbConnector.ImageProjet.findAll({
            where: { projetId: id },
        });
        if (existingImages.length + files.length > 8) {
            logMessage("Limite de 8 images par projet atteinte", COLOR_RED);
            // Supprimer les fichiers téléchargés en cas d'erreur
            files.forEach((file) => {
                fs.unlink(file.path, (err) => {
                    if (err) console.log(err);
                });
            });
            return res
                .status(400)
                .json({ message: "Limite de 8 images par projet atteinte" });
        }

        logMessage("Ajout des nouvelles images au projet", COLOR_YELLOW);
        const images = [];
        for (const file of files) {
            const newImageProjet = await dbConnector.ImageProjet.create({
                nom: file.filename,
                dateCreation: new Date(),
                dateModif: new Date(),
                projetId: id,
            });
            images.push(newImageProjet);
        }

        logMessage("Images projet ajoutées avec succès", COLOR_GREEN);
        res.status(201).json({
            message: "Images projet ajoutées avec succès",
            images,
        });
    } catch (error) {
        logMessage("Erreur lors de l'ajout des images projet", COLOR_RED);
        console.error("Erreur lors de l'ajout des images projet :", error);
        res.status(500).json({
            message: "Erreur lors de l'ajout des images projet",
        });
    }
};

// Récupérer toutes les images par projet
exports.getAllByProjetId = async (req, res, next) => {
    logMessage(
        "Début de la récupération des images par projet ID",
        COLOR_YELLOW
    );

    try {
        const { id } = req.params;
        logMessage(`ID du projet : ${id}`, COLOR_YELLOW);

        logMessage("Vérification de l'existence du projet", COLOR_YELLOW);
        const projet = await dbConnector.Projet.findByPk(id);
        if (!projet) {
            logMessage("Projet non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        logMessage("Récupération des images associées au projet", COLOR_YELLOW);
        const images = await dbConnector.ImageProjet.findAll({
            where: { projetId: id },
        });

        logMessage("Images récupérées avec succès", COLOR_GREEN);
        res.status(200).json({ images });
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des images par projet",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération des images par projet :",
            error
        );
        res.status(500).json({
            message: "Erreur lors de la récupération des images par projet",
        });
    }
};

// Mettre à jour les images d'un projet par ID
exports.updateByProjetId = async (req, res, next) => {
    logMessage(
        `Début de la mise à jour des images pour le projet avec ID: ${req.params.id}`,
        COLOR_YELLOW
    );

    try {
        const { files } = req;
        const { id } = req.params;
        const imagesToRemove = req.body.imagesToDelete
            ? JSON.parse(req.body.imagesToDelete)
            : []; // Convertir en tableau si nécessaire

        logMessage(`ID du projet : ${id}`, COLOR_YELLOW);
        logMessage(
            `Images à supprimer : ${JSON.stringify(imagesToRemove)}`,
            COLOR_YELLOW
        );

        // Vérifier si le projet existe
        logMessage("Vérification de l'existence du projet", COLOR_YELLOW);
        const projet = await dbConnector.Projet.findByPk(id);
        if (!projet) {
            logMessage("Projet non trouvé", COLOR_RED);
            if (files && files.length > 0) {
                files.forEach((file) => {
                    fs.unlink(file.path, (err) => {
                        if (err) console.log(err);
                    });
                });
            }
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        // Supprimer les anciennes images si elles sont spécifiées
        if (Array.isArray(imagesToRemove) && imagesToRemove.length > 0) {
            logMessage(
                "Suppression des anciennes images sélectionnées",
                COLOR_YELLOW
            );
            for (const imageId of imagesToRemove) {
                const imageProjet = await dbConnector.ImageProjet.findByPk(
                    imageId
                );
                if (imageProjet && imageProjet.projetId === parseInt(id)) {
                    logMessage(
                        `Suppression de l'image ID: ${imageId}`,
                        COLOR_YELLOW
                    );

                    // Supprimer le fichier d'image du système de fichiers
                    const imagePath = path.join(
                        __dirname,
                        "../uploads/",
                        imageProjet.nom
                    );
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            logMessage(
                                `Erreur lors de la suppression du fichier de l'image projet ${imageId}`,
                                COLOR_RED
                            );
                            console.log(err);
                        } else {
                            logMessage(
                                `Fichier de l'image ${imageProjet.nom} supprimé du système de fichiers`,
                                COLOR_GREEN
                            );
                        }
                    });

                    // Supprimer l'enregistrement de l'image de la base de données
                    await imageProjet.destroy();
                    logMessage(
                        `Image projet ${imageId} supprimée de la base de données`,
                        COLOR_GREEN
                    );
                } else {
                    logMessage(
                        `Image ID: ${imageId} non trouvée ou ne correspond pas au projet`,
                        COLOR_RED
                    );
                }
            }
        }

        // Ajouter les nouvelles images au projet si des fichiers sont fournis
        if (files && files.length > 0) {
            logMessage("Ajout des nouvelles images au projet", COLOR_YELLOW);
            const images = [];
            for (const file of files) {
                const newImageProjet = await dbConnector.ImageProjet.create({
                    nom: file.filename,
                    dateCreation: new Date(),
                    dateModif: new Date(),
                    projetId: id,
                });
                images.push(newImageProjet);
            }

            logMessage("Images projet mises à jour avec succès", COLOR_GREEN);
            return res.status(200).json({
                message: "Images projet mises à jour avec succès",
                images,
            });
        }

        // Si aucune nouvelle image n'est ajoutée, retourner un message approprié
        logMessage(
            "Opération terminée, seules les suppressions ont été effectuées",
            COLOR_GREEN
        );
        res.status(200).json({
            message:
                "Opération terminée avec succès, aucune nouvelle image ajoutée",
        });
    } catch (error) {
        logMessage(
            "Erreur lors de la mise à jour des images projet",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la mise à jour des images projet :",
            error
        );
        res.status(500).json({
            message: "Erreur lors de la mise à jour des images projet",
        });
    }
};

// Supprimer une image par ID
exports.delete = async (req, res, next) => {
    logMessage("Début de la suppression de l'image projet", COLOR_YELLOW);

    try {
        const imageId = req.params.id;
        logMessage(`ID de l'image projet : ${imageId}`, COLOR_YELLOW);

        logMessage(
            "Vérification de l'existence de l'image projet",
            COLOR_YELLOW
        );
        const imageProjet = await dbConnector.ImageProjet.findByPk(imageId);
        if (!imageProjet) {
            logMessage("Image projet non trouvée", COLOR_RED);
            return res
                .status(404)
                .json({ message: "Image projet non trouvée" });
        }

        logMessage("Suppression du fichier d'image", COLOR_YELLOW);
        const imagePath = path.join(__dirname, "../uploads/", imageProjet.nom);
        fs.unlink(imagePath, (err) => {
            if (err) {
                logMessage(
                    "Erreur lors de la suppression de l'image projet",
                    COLOR_RED
                );
                console.log(
                    "Erreur lors de la suppression de l'image projet:",
                    err
                );
            } else {
                logMessage(
                    `Image ${imageProjet.nom} supprimée du système de fichiers`,
                    COLOR_GREEN
                );
            }
        });

        logMessage(
            "Suppression de l'image projet de la base de données",
            COLOR_YELLOW
        );
        await imageProjet.destroy();

        logMessage(
            `Image projet ${imageId} supprimée avec succès`,
            COLOR_GREEN
        );
        res.status(200).json({ message: "Image projet supprimée avec succès" });
    } catch (error) {
        logMessage(
            "Erreur lors de la suppression de l'image projet",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la suppression de l'image projet :",
            error
        );
        res.status(500).json({
            message: "Erreur lors de la suppression de l'image projet",
        });
    }
};
