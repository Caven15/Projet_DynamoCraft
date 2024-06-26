const dbConnector = require("../tools/ConnexionDb.tools").get();
const fs = require("fs");
const path = require("path");
const projectController = require("../controllers/projet.controller");
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

// Récupérer tous les utilisateurs
exports.getAll = async (req, res, next) => {
    logMessage(
        "Début de la récupération de tous les utilisateurs",
        COLOR_YELLOW
    );

    try {
        const allUsers = await dbConnector.Utilisateur.findAll({
            attributes: {
                exclude: ["password", "imageId", "roleId"],
            },
            include: [
                {
                    model: dbConnector.ImageUtilisateur,
                    attributes: ["nom", "id"],
                },
                {
                    model: dbConnector.Role,
                    attributes: ["nom"],
                },
            ],
        });

        logMessage("Utilisateurs récupérés avec succès", COLOR_GREEN);
        res.status(200).json(allUsers);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des utilisateurs",
            COLOR_RED
        );
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de la récupération des utilisateurs",
        });
    }
};

// Récupérer un utilisateur par ID
exports.getById = async (req, res, next) => {
    logMessage(
        `Début de la récupération de l'utilisateur avec ID: ${req.params.id}`,
        COLOR_YELLOW
    );

    try {
        const user = await dbConnector.Utilisateur.findOne({
            where: {
                id: req.params.id,
            },
            attributes: {
                exclude: ["password", "imageId", "roleId"],
            },
            include: [
                {
                    model: dbConnector.ImageUtilisateur,
                    attributes: ["nom", "id"],
                },
                {
                    model: dbConnector.Role,
                    attributes: ["nom"],
                },
            ],
        });

        if (user) {
            logMessage("Utilisateur récupéré avec succès", COLOR_GREEN);
            res.status(200).json(user);
        } else {
            logMessage("Utilisateur non trouvé", COLOR_RED);
            res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération de l'utilisateur par ID",
            COLOR_RED
        );
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de la récupération de l'utilisateur par ID",
        });
    }
};

// Mettre à jour un utilisateur par ID
exports.update = async (req, res, next) => {
    logMessage(
        `Début de la mise à jour de l'utilisateur avec ID: ${req.params.id}`,
        COLOR_YELLOW
    );

    try {
        const {
            pseudo,
            email,
            dateNaissance,
            biographie,
            centreInterets,
            statutCompte,
        } = req.body;
        const file = req.file;

        const user = await dbConnector.Utilisateur.findByPk(req.params.id);
        if (!user) {
            logMessage("Utilisateur non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (email) {
            const existingUser = await dbConnector.Utilisateur.findOne({
                where: {
                    email,
                    id: { [dbConnector.Sequelize.Op.ne]: req.params.id },
                },
            });
            if (existingUser) {
                logMessage(
                    "L'adresse e-mail existe déjà dans le système",
                    COLOR_RED
                );
                return res.status(403).json({
                    message: "L'adresse e-mail existe déjà dans le système",
                });
            }
        }

        if (file) {
            const imageUtilisateur = await dbConnector.ImageUtilisateur.findOne(
                { where: { utilisateurId: user.id } }
            );
            const newImage = {
                nom: file.filename,
                utilisateurId: user.id,
            };

            if (imageUtilisateur) {
                const oldImagePath = `./uploads/${imageUtilisateur.nom}`;
                fs.unlink(oldImagePath, (err) => {
                    if (err)
                        console.log(
                            "Erreur lors de la suppression de l'ancienne image:",
                            err
                        );
                });
                await imageUtilisateur.update(newImage);
            } else {
                await dbConnector.ImageUtilisateur.create(newImage);
            }

            await user.update({ imageId: newImage.id });
        }

        await user.update({
            pseudo,
            email,
            dateNaissance,
            biographie,
            centreInterets,
            statutCompte,
            dateModif: new Date(),
        });

        logMessage("Utilisateur mis à jour avec succès", COLOR_GREEN);
        res.status(200).json({
            message: `Utilisateur ${req.params.id} mis à jour avec succès !`,
        });
    } catch (error) {
        logMessage("Erreur lors de la mise à jour de l'utilisateur", COLOR_RED);
        console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
        res.status(500).json({
            message: "Erreur lors de la mise à jour de l'utilisateur",
        });
    }
};

// Supprimer un utilisateur par ID
exports.delete = async (req, res, next) => {
    logMessage(
        `Début de la suppression de l'utilisateur avec ID: ${req.params.id}`,
        COLOR_YELLOW
    );

    try {
        const user = await dbConnector.Utilisateur.findByPk(req.params.id);
        if (user) {
            const userProjects = await dbConnector.Projet.findAll({
                where: { utilisateurId: user.id },
            });
            for (const project of userProjects) {
                await projectController.deleteProjectById(project.id);
            }

            const imageUtilisateur = await dbConnector.ImageUtilisateur.findOne(
                { where: { utilisateurId: user.id } }
            );
            if (imageUtilisateur) {
                await imageUtilisateur.destroy();
                const imagePath = `./uploads/${imageUtilisateur.nom}`;
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        logMessage(
                            "Erreur lors de la suppression de l'image",
                            COLOR_RED
                        );
                        console.error(
                            "Erreur lors de la suppression de l'image:",
                            err
                        );
                    } else {
                        logMessage("Image supprimée avec succès", COLOR_GREEN);
                    }
                });
            }

            await user.destroy();
            logMessage("Utilisateur supprimé avec succès", COLOR_GREEN);
            res.status(200).json({
                message: `Utilisateur ${req.params.id} supprimé avec succès !`,
            });
        } else {
            logMessage("Utilisateur non trouvé", COLOR_RED);
            res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    } catch (error) {
        logMessage("Erreur lors de la suppression de l'utilisateur", COLOR_RED);
        console.error("Erreur lors de la suppression de l'utilisateur:", error);
        res.status(500).json({
            message: "Erreur lors de la suppression de l'utilisateur",
        });
    }
};
