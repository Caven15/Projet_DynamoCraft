const dbConnector = require("../tools/ConnexionDb.tools").get();
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const {
    logMessage,
    logSQLQuery,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

// Supprimer un projet par ID avec req et res
exports.create = async (req, res, next) => {
    logMessage("Début de la création du projet", COLOR_YELLOW);

    try {
        const { nom, description, categorieId } = req.body;
        const { files } = req;

        // Extraire l'utilisateur du token JWT
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const utilisateurId = decodedToken.id;

        if (!nom || !categorieId || !description || !utilisateurId) {
            logMessage(
                "Le nom, la description, la catégorie et l'utilisateur sont obligatoires",
                COLOR_RED
            );
            return res.status(400).json({
                message:
                    "Le nom, la description, la catégorie et l'utilisateur sont obligatoires",
            });
        }

        // Vérifier l'unicité du nom du projet
        logMessage(
            `Vérification de l'unicité du nom du projet: ${nom}`,
            COLOR_YELLOW
        );
        const existingProject = await dbConnector.Projet.findOne({
            where: { nom },
        });
        if (existingProject) {
            logMessage("Un projet avec ce nom existe déjà", COLOR_RED);
            return res
                .status(400)
                .json({ message: "Un projet avec ce nom existe déjà" });
        }

        // Vérifier si l'utilisateur existe
        logMessage(
            `Vérification de l'existence de l'utilisateur avec ID: ${utilisateurId}`,
            COLOR_YELLOW
        );
        const utilisateur = await dbConnector.Utilisateur.findByPk(
            utilisateurId
        );
        if (!utilisateur) {
            logMessage("Utilisateur non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Créer une nouvelle statistique
        logMessage("Création d'une nouvelle statistique", COLOR_YELLOW);
        const newStat = await dbConnector.Statistique.create({
            nombreApreciation: 0,
            nombreTelechargement: 0,
            datePublication: new Date(),
            dateModification: new Date(),
        });

        // Créer le projet avec la référence de la statistique
        logMessage(
            "Création du projet avec la référence de la statistique",
            COLOR_YELLOW
        );
        const newProjet = await dbConnector.Projet.create({
            nom,
            description,
            estvalide: false,
            commentaire_admin: "En attente de validation.",
            statutId: 3,
            statistiqueId: newStat.id,
            categorieId,
            utilisateurId,
        });

        // Vérifier si le dossier 'uploads' existe, sinon le créer
        const uploadPath = path.join(__dirname, "../uploads/");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
            logMessage("Dossier 'uploads' créé avec succès", COLOR_GREEN);
        }

        // Vérifier le nombre total d'images pour ce projet uniquement
        const existingImagesCount = await dbConnector.ImageProjet.count({
            where: { projetId: newProjet.id },
        });

        if (existingImagesCount + (files ? files.length : 0) > 8) {
            logMessage("Limite de 8 images par projet atteinte", COLOR_RED);
            return res
                .status(400)
                .json({ message: "Limite de 8 images par projet atteinte" });
        }

        // Associer les images au projet si présentes
        if (files && files.length > 0) {
            const images = [];
            for (const file of files) {
                const newImageProjet = await dbConnector.ImageProjet.create({
                    nom: file.filename,
                    dateCreation: new Date(),
                    dateModif: new Date(),
                    projetId: newProjet.id,
                });
                images.push(newImageProjet);
            }
            logMessage("Projet créé avec succès avec images", COLOR_GREEN);
            return res.status(201).json({
                message: "Projet créé avec succès",
                projet: newProjet,
                images,
            });
        } else {
            logMessage("Projet créé avec succès sans images", COLOR_GREEN);
            return res.status(201).json({
                message: "Projet créé avec succès",
                projet: newProjet,
            });
        }
    } catch (error) {
        logMessage("Erreur lors de la création du projet", COLOR_RED);
        console.error("Erreur lors de la création du projet :", error);
        return res
            .status(500)
            .json({ message: "Erreur lors de la création du projet" });
    }
};

// Récupérer tous les projets
exports.getAll = async (req, res, next) => {
    logMessage("Début de la récupération de tous les projets", COLOR_YELLOW);
    try {
        const projects = await dbConnector.Projet.findAll({
            include: [
                {
                    model: dbConnector.Statut,
                    as: "statut",
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Statistique,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Categorie,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Utilisateur,
                    as: "utilisateur",
                    attributes: { exclude: ["roleId"] },
                },
            ],
            attributes: {
                exclude: [
                    "statutId",
                    "statistiqueId",
                    "categorieId",
                    "utilisateurId",
                ],
            },
        });
        logMessage("Tous les projets récupérés avec succès", COLOR_GREEN);
        return res.status(200).json(projects);
    } catch (error) {
        logMessage("Erreur lors de la récupération des projets", COLOR_RED);
        console.error("Erreur lors de la récupération des projets :", error);
        return res
            .status(500)
            .json({ message: "Erreur lors de la récupération des projets" });
    }
};

// Récupérer un projet par ID
exports.getById = async (req, res, next) => {
    logMessage(
        `Début de la récupération du projet avec ID: ${req.params.id}`,
        COLOR_YELLOW
    );
    try {
        const projectId = req.params.id;

        const projet = await dbConnector.Projet.findByPk(projectId, {
            include: [
                { model: dbConnector.Statut, as: "statut" },
                {
                    model: dbConnector.Statistique,
                    attributes: [
                        "nombreApreciation",
                        "nombreTelechargement",
                        "datePublication",
                        "dateModification",
                    ],
                },
                {
                    model: dbConnector.Utilisateur,
                    as: "utilisateur",
                    attributes: { exclude: ["roleId", "password"] },
                    include: [
                        {
                            model: dbConnector.ImageUtilisateur,
                            as: "imageUtilisateur", // Assurez-vous d'utiliser l'alias correct
                            attributes: ["nom"], // Inclure uniquement le champ nécessaire
                        },
                    ],
                },
                {
                    model: dbConnector.ImageProjet,
                    as: "imageProjet", // Assurez-vous d'utiliser l'alias correct
                    attributes: ["nom"], // Inclure uniquement le champ nécessaire
                },
                {
                    model: dbConnector.Categorie,
                    as: "categorie", // Inclure la catégorie associée au projet
                },
            ],
            attributes: {
                exclude: [
                    "statutId",
                    "statistiqueId",
                    "utilisateurId",
                    "categorieId",
                ],
            },
        });

        if (!projet) {
            logMessage("Projet non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        const projetWithDetails = {
            ...projet.toJSON(),
            categorieId: projet.categorieId, // Assurez-vous de conserver la catégorie ID si nécessaire
        };

        // Log les détails du projet, y compris l'utilisateur, les images et la catégorie
        logMessage(
            `Détails du projet: ${JSON.stringify(projetWithDetails)}`,
            COLOR_GREEN
        );

        return res.status(200).json(projetWithDetails);
    } catch (error) {
        logMessage("Erreur lors de la récupération du projet", COLOR_RED);
        console.error("Erreur lors de la récupération du projet :", error);
        return res
            .status(500)
            .json({ message: "Erreur lors de la récupération du projet" });
    }
};

// Récupérer les projets par utilisateurId
exports.getByUserId = async (req, res, next) => {
    logMessage(
        `Début de la récupération des projets pour l'utilisateur avec ID: ${req.params.id}`,
        COLOR_YELLOW
    );
    try {
        const userId = req.params.id;
        const projects = await dbConnector.Projet.findAll({
            where: {
                utilisateurId: userId,
            },
            include: [
                { model: dbConnector.Statut, as: "statut" },
                { model: dbConnector.Statistique },
                { model: dbConnector.Categorie },
                {
                    model: dbConnector.Utilisateur,
                    attributes: { exclude: ["roleId"] },
                },
                {
                    model: dbConnector.Utilisateur,
                    attributes: { exclude: ["password"] },
                },
                {
                    model: dbConnector.ImageProjet,
                    as: "imageProjet",
                    attributes: ["nom", "dateCreation"],
                },
            ],
            attributes: {
                exclude: [
                    "statutId",
                    "statistiqueId",
                    "categorieId",
                    "utilisateurId",
                ],
            },
        });

        logMessage(
            `Projets pour l'utilisateur avec ID: ${req.params.id} récupérés avec succès`,
            COLOR_GREEN
        );
        return res.status(200).json(projects);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des projets par utilisateurId",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération des projets par utilisateurId :",
            error
        );
        return res.status(500).json({
            message:
                "Erreur lors de la récupération des projets par utilisateurId",
        });
    }
};

// Mettre à jour un projet par ID
exports.updateById = async (req, res, next) => {
    logMessage(
        `Début de la mise à jour du projet avec ID: ${req.params.id}`,
        COLOR_YELLOW
    );
    try {
        const { nom, description, categorieId } = req.body;
        const projectId = req.params.id;

        const projet = await dbConnector.Projet.findByPk(projectId);
        if (!projet) {
            logMessage("Projet non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        await projet.update({
            nom,
            description,
            categorieId,
        });

        logMessage(
            `Projet avec ID: ${req.params.id} mis à jour avec succès`,
            COLOR_GREEN
        );
        return res
            .status(200)
            .json({ message: `Projet ${projectId} mis à jour avec succès !` });
    } catch (error) {
        logMessage("Erreur lors de la mise à jour du projet", COLOR_RED);
        console.error("Erreur lors de la mise à jour du projet :", error);
        return res
            .status(500)
            .json({ message: "Erreur lors de la mise à jour du projet" });
    }
};

// Supprimer un projet par ID avec req et res
exports.delete = async (req, res, next) => {
    logMessage(`Début de la suppression du projet avec ID: ${req.params.id}`, COLOR_YELLOW);

    try {
        const projectId = req.params.id;

        // Vérification de l'existence du projet
        const projet = await dbConnector.Projet.findByPk(projectId);
        if (!projet) {
            logMessage("Projet non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        // Supprimer toutes les images associées au projet
        const images = await dbConnector.ImageProjet.findAll({
            where: { projetId: projectId },
        });
        for (const image of images) {
            if (image.nom) {
                const imagePath = path.join(__dirname, "../uploads/", image.nom);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    logMessage(`Image ${image.nom} supprimée`, COLOR_GREEN);
                }

                const resizedImagePath = path.join(__dirname, "../uploads/resized/", image.nom);
                if (fs.existsSync(resizedImagePath)) {
                    fs.unlinkSync(resizedImagePath);
                    logMessage(`Image redimensionnée ${image.nom} supprimée`, COLOR_GREEN);
                }
            }
        }
        await dbConnector.ImageProjet.destroy({
            where: { projetId: projectId },
        });

        // Supprimer tous les fichiers 3D associés au projet
        const modeles3D = await dbConnector.Modele3D.findAll({
            where: { projetId: projectId },
        });

        console.log(modeles3D[0]);

        console.log(modeles3D);
        for (const modele of modeles3D) {
            if (modele.nom) {
                // Vérifier si le fichier 3D existe avant de le supprimer
                const modele3DPath = path.join(__dirname, "../uploads/", modele.nom);
                if (fs.existsSync(modele3DPath)) {
                    fs.unlinkSync(modele3DPath); // Suppression synchrone des fichiers 3D
                    logMessage(`Fichier 3D ${modele.nom} supprimé`, COLOR_GREEN);
                } else {
                    logMessage(`Fichier 3D ${modele.nom} introuvable dans le répertoire`, COLOR_RED);
                }
            }
        }
        await dbConnector.Modele3D.destroy({
            where: { projetId: projectId },
        });

        // Supprimer tous les commentaires associés au projet
        await dbConnector.Commentaire.destroy({
            where: { projetId: projectId },
        });

        // Supprimer tous les liens dans la table utilisateurProjet
        await dbConnector.UtilisateurProjet.destroy({
            where: { projetId: projectId },
        });

        // Supprimer le projet lui-même
        await projet.destroy();

        // Supprimer les statistiques associées au projet
        await dbConnector.Statistique.destroy({
            where: { id: projet.statistiqueId },
        });

        logMessage(`Projet avec ID: ${projectId} supprimé avec succès`, COLOR_GREEN);
        return res.status(200).json({ message: `Projet ${projectId} supprimé avec succès !` });
    } catch (error) {
        logMessage("Erreur lors de la suppression du projet", COLOR_RED);
        console.error("Erreur lors de la suppression du projet :", error);
        return res.status(500).json({ message: "Erreur lors de la suppression du projet" });
    }
};

// Récupérer tous les projets par catégorie
exports.getByCategoryId = async (req, res, next) => {
    logMessage(
        `Début de la récupération des projets pour la catégorie avec ID: ${req.params.id}`,
        COLOR_YELLOW
    );
    try {
        const categoryId = req.params.id;

        const categorie = await dbConnector.Categorie.findByPk(categoryId);
        if (!categorie) {
            logMessage("Catégorie non trouvée", COLOR_RED);
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        const projects = await dbConnector.Projet.findAll({
            where: { categorieId: categoryId },
            include: [
                { model: dbConnector.Statut, attributes: { exclude: ["id"] } },
                {
                    model: dbConnector.Statistique,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Categorie,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Utilisateur,
                    attributes: { exclude: ["id", "password"] },
                },
            ],
        });

        logMessage(
            `Projets pour la catégorie avec ID: ${req.params.id} récupérés avec succès`,
            COLOR_GREEN
        );
        return res.status(200).json({ projects });
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des projets par catégorie",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération des projets par catégorie :",
            error
        );
        return res.status(500).json({
            message: "Erreur lors de la récupération des projets par catégorie",
        });
    }
};

// Récupérer les projets par nom de catégorie
exports.getByCategoryName = async (req, res, next) => {
    logMessage(
        `Début de la récupération des projets pour la catégorie avec le nom: ${req.params.nom}`,
        COLOR_YELLOW
    );
    try {
        const categoryName = req.params.nom;

        // Vérifier si la catégorie existe
        const categorie = await dbConnector.Categorie.findOne({
            where: { nom: categoryName },
            attributes: ["id", "nom"], // Inclure uniquement les champs nécessaires
        });

        if (!categorie) {
            logMessage("Catégorie non trouvée", COLOR_RED);
            return res.status(200).json([]);
        }

        // Récupérer les projets liés à cette catégorie
        const projects = await dbConnector.Projet.findAll({
            where: { categorieId: categorie.id },
            include: [
                {
                    model: dbConnector.Categorie,
                    as: "categorie",
                    attributes: ["nom"],
                },
                {
                    model: dbConnector.Statut,
                    as: "statut",
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Statistique,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Utilisateur,
                    as: "utilisateur",
                    attributes: { exclude: ["id", "password"] },
                },
                {
                    model: dbConnector.ImageProjet,
                    as: "imageProjet",
                    attributes: ["nom", "dateCreation"],
                },
            ],
            attributes: {
                exclude: [
                    "statutId",
                    "statistiqueId",
                    "categorieId",
                    "utilisateurId",
                ],
            },
        });

        logMessage(
            `Projets pour la catégorie avec nom: ${categoryName} récupérés avec succès`,
            COLOR_GREEN
        );
        return res.status(200).json(projects);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des projets par nom de catégorie",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération des projets par nom de catégorie :",
            error
        );
        return res.status(500).json({
            message:
                "Erreur lors de la récupération des projets par nom de catégorie",
        });
    }
};

// Récupérer tous les projets valides
exports.getValidProjet = async (req, res, next) => {
    logMessage("Début de la récupération des projets valides", COLOR_YELLOW);
    try {
        const projects = await dbConnector.Projet.findAll({
            where: { statutId: 1 },
            include: [
                {
                    model: dbConnector.Statut,
                    as: "statut",
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Statistique,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Categorie,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Utilisateur,
                    as: "utilisateur",
                    attributes: { exclude: ["id", "password"] },
                },
            ],
        });

        logMessage("Projets valides récupérés avec succès", COLOR_GREEN);
        return res.status(200).json(projects);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des projets valides",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération des projets valides :",
            error
        );
        return res.status(500).json({
            message: "Erreur lors de la récupération des projets valides",
        });
    }
};

// Récupérer tous les projets invalides
exports.getInvalidProjet = async (req, res, next) => {
    logMessage("Début de la récupération des projets invalides", COLOR_YELLOW);
    try {
        const projects = await dbConnector.Projet.findAll({
            where: { statutId: 2 },
            include: [
                {
                    model: dbConnector.Statut,
                    as: "statut",
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Statistique,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Categorie,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Utilisateur,
                    as: "utilisateur",
                    attributes: { exclude: ["id", "password"] },
                },
            ],
        });

        logMessage("Projets invalides récupérés avec succès", COLOR_GREEN);
        return res.status(200).json(projects);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des projets invalides",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération des projets invalides :",
            error
        );
        return res.status(500).json({
            message: "Erreur lors de la récupération des projets invalides",
        });
    }
};

// Récupérer tous les projets en attente
exports.getPendingProjet = async (req, res, next) => {
    logMessage("Début de la récupération des projets en attente", COLOR_YELLOW);
    try {
        const projects = await dbConnector.Projet.findAll({
            where: { statutId: 3 },
            include: [
                {
                    model: dbConnector.Statut,
                    as: "statut",
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Statistique,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Categorie,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Utilisateur,
                    as: "utilisateur",
                    attributes: { exclude: ["id", "password"] },
                },
            ],
        });

        logMessage("Projets en attente récupérés avec succès", COLOR_GREEN);
        return res.status(200).json(projects);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des projets en attente",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération des projets en attente :",
            error
        );
        return res.status(500).json({
            message: "Erreur lors de la récupération des projets en attente",
        });
    }
};

// Mettre à jour l'état d'un projet en "valide"
exports.setValidProjet = async (req, res, next) => {
    logMessage(
        `Début de la mise à jour du projet avec ID: ${req.params.id} en "valide"`,
        COLOR_YELLOW
    );
    try {
        const projectId = req.params.id;
        const { commentaire_admin } = req.body; // Utilisation de camelCase

        console.log(commentaire_admin);

        const project = await dbConnector.Projet.findByPk(projectId);

        if (!project) {
            logMessage("Projet non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        await project.update({
            estValide: 1,
            statutId: 1,
            commentaire_admin: commentaire_admin || "Le projet a été validé.", // Utilisation du commentaire reçu ou par défaut
        });

        logMessage(
            `Projet avec ID: ${req.params.id} mis à jour en "valide" avec succès`,
            COLOR_GREEN
        );
        return res.status(200).json({
            message: `Le projet ${projectId} a été mis à jour en "valide".`,
        });
    } catch (error) {
        logMessage(
            "Erreur lors de la mise à jour du projet en valide",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la mise à jour du projet en valide :",
            error
        );
        return res.status(500).json({
            message: "Erreur lors de la mise à jour du projet en valide.",
        });
    }
};

// Mettre à jour l'état d'un projet en "invalide"
exports.setInvalidProjet = async (req, res, next) => {
    logMessage(
        `Début de la mise à jour du projet avec ID: ${req.params.id} en "invalide"`,
        COLOR_YELLOW
    );
    try {
        const projectId = req.params.id;
        const { commentaire_admin } = req.body;

        const project = await dbConnector.Projet.findByPk(projectId);

        if (!project) {
            logMessage("Projet non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        await project.update({
            estValide: false,
            statutId: 2,
            commentaire_admin: commentaire_admin || "Le projet a été invalidé.",
        });

        logMessage(
            `Projet avec ID: ${req.params.id} mis à jour en "invalide" avec succès`,
            COLOR_GREEN
        );
        return res.status(200).json({
            message: `Le projet ${projectId} a été mis à jour en "invalide".`,
        });
    } catch (error) {
        logMessage(
            "Erreur lors de la mise à jour du projet en invalide",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la mise à jour du projet en invalide :",
            error
        );
        return res.status(500).json({
            message: "Erreur lors de la mise à jour du projet en invalide.",
        });
    }
};

// Mettre à jour l'état d'un projet en "en attente"
exports.setPendingProjet = async (req, res, next) => {
    logMessage(
        `Début de la mise à jour du projet avec ID: ${req.params.id} en "en attente"`,
        COLOR_YELLOW
    );
    try {
        const projectId = req.params.id;
        const { commentaire_admin } = req.body;

        const project = await dbConnector.Projet.findByPk(projectId);

        if (!project) {
            logMessage("Projet non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        await project.update({
            estValide: false,
            statutId: 3,
            commentaire_admin:
                commentaire_admin || "Le projet est en attente de validation.",
        });

        logMessage(
            `Projet avec ID: ${req.params.id} mis à jour en "en attente" avec succès`,
            COLOR_GREEN
        );
        return res.status(200).json({
            message: `Le projet ${projectId} a été mis à jour en "en attente".`,
        });
    } catch (error) {
        logMessage(
            "Erreur lors de la mise à jour du projet en attente",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la mise à jour du projet en attente :",
            error
        );
        return res.status(500).json({
            message: "Erreur lors de la mise à jour du projet en attente.",
        });
    }
};

// Incrémenter le nombre de likes pour un projet spécifique
exports.incrementLike = async (req, res, next) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const utilisateurId = decodedToken.id;

        // Log des valeurs reçues
        logMessage(`ID utilisateur reçu: ${utilisateurId}`, COLOR_YELLOW);
        logMessage(`ID projet reçu: ${id}`, COLOR_YELLOW);

        // Vérifier la validité des ID
        if (!utilisateurId || !id) {
            logMessage(
                "L'ID utilisateur ou l'ID projet est manquant.",
                COLOR_RED
            );
            return res
                .status(400)
                .json({ message: "ID utilisateur ou ID projet manquant." });
        }

        // Vérifier si l'utilisateur a déjà liké ce projet
        logMessage(
            "Vérification si l'utilisateur a déjà liké ce projet...",
            COLOR_YELLOW
        );
        const existingLike = await dbConnector.UtilisateurProjetLike.findOne({
            where: {
                utilisateurId: utilisateurId,
                projetId: id,
            },
        });

        if (existingLike) {
            logMessage(
                `L'utilisateur ${utilisateurId} a déjà liké le projet ${id}`,
                COLOR_RED
            );
            return res
                .status(400)
                .json({ message: "Vous avez déjà liké ce projet." });
        }

        // Incrémenter le nombre de likes
        logMessage(
            `Incrémentation du nombre de likes pour le projet Id=${id}`,
            COLOR_YELLOW
        );
        const [updated] = await dbConnector.Statistique.increment(
            "nombreApreciation",
            {
                where: { id: id },
            }
        );

        if (updated) {
            logMessage(
                `Le nombre de likes pour le projet Id=${id} a été incrémenté avec succès.`,
                COLOR_GREEN
            );
        } else {
            logMessage(
                `Échec de l'incrémentation des likes pour le projet Id=${id}`,
                COLOR_RED
            );
            return res
                .status(500)
                .json({ message: "Échec de l'incrémentation des likes." });
        }

        // Ajouter un nouveau like
        logMessage(
            `Ajout du like pour utilisateurId=${utilisateurId} et projetId=${id}`,
            COLOR_YELLOW
        );
        await dbConnector.UtilisateurProjetLike.create({
            utilisateurId: utilisateurId,
            projetId: id,
        });

        logMessage(
            `Like ajouté avec succès pour utilisateurId=${utilisateurId} et projetId=${id}`,
            COLOR_GREEN
        );
        return res.status(200).json({
            message: "Like ajouté avec succès.",
        });
    } catch (error) {
        logMessage(
            `Erreur lors de l'ajout du like : ${error.message}`,
            COLOR_RED
        );
        return res
            .status(500)
            .json({ message: "Erreur lors de l'ajout du like." });
    }
};

// Incrémenter le nombre de téléchargements pour un projet spécifique
exports.incrementDownload = async (req, res, next) => {
    logMessage(
        `Début de l'incrémentation du nombre de téléchargements pour le projet avec ID: ${req.params.id}`,
        COLOR_YELLOW
    );
    try {
        const projectId = req.params.id;
        const project = await dbConnector.Projet.findByPk(projectId);
        if (!project) {
            logMessage("Projet non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        await dbConnector.Statistique.increment("nombreTelechargement", {
            where: { id: project.statistiqueId },
        });

        logMessage(
            `Nombre de téléchargements incrémenté avec succès pour le projet avec ID: ${req.params.id}`,
            COLOR_GREEN
        );
        return res.status(200).json({
            message:
                "Nombre de téléchargements incrémenté avec succès pour le projet " +
                projectId,
        });
    } catch (error) {
        logMessage(
            "Erreur lors de l'incrémentation du nombre de téléchargements pour le projet",
            COLOR_RED
        );
        console.error(
            "Erreur lors de l'incrémentation du nombre de téléchargements pour le projet :",
            error
        );
        return res.status(500).json({
            message:
                "Erreur lors de l'incrémentation du nombre de téléchargements pour le projet",
        });
    }
};

// Récupérer les 10 projets les plus likés
exports.getTop10Liked = async (req, res, next) => {
    logMessage(
        "Début de la récupération des 10 projets les plus likés",
        COLOR_YELLOW
    );
    try {
        const topProjects = await dbConnector.Projet.findAll({
            where: {
                estValide: true, // Ajout de la condition pour n'inclure que les projets validés
            },
            include: [
                {
                    model: dbConnector.Statistique,
                    attributes: ["nombreApreciation"],
                },
                {
                    model: dbConnector.Statut,
                    as: "statut",
                    attributes: ["nom"],
                    where: {
                        nom: "Valide", // Filtre basé sur le statut "Valide"
                    },
                },
                {
                    model: dbConnector.Categorie,
                    attributes: ["nom"],
                },
                {
                    model: dbConnector.Utilisateur,
                    as: "utilisateur",
                    attributes: ["pseudo", "id"],
                    include: [
                        {
                            model: dbConnector.ImageUtilisateur,
                            attributes: ["nom"],
                        },
                    ],
                },
                {
                    model: dbConnector.ImageProjet,
                    as: "imageProjet",
                    attributes: ["nom", "dateCreation"],
                },
            ],
            attributes: {
                exclude: [
                    "statutId",
                    "statistiqueId",
                    "categorieId",
                    "utilisateurId",
                ],
            },
            order: [
                [
                    { model: dbConnector.Statistique },
                    "nombreApreciation",
                    "DESC",
                ],
            ],
            limit: 10,
        });

        logMessage(
            "Les 10 projets les plus likés récupérés avec succès",
            COLOR_GREEN
        );
        return res.status(200).json(topProjects);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des 10 projets les plus likés",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération des 10 projets les plus likés :",
            error
        );
        return res.status(500).json({
            message:
                "Erreur lors de la récupération des 10 projets les plus likés",
        });
    }
};

// Récupérer les 16 derniers projets créés
exports.getLast = async (req, res, next) => {
    logMessage(
        "Début de la récupération des 16 derniers projets créés",
        COLOR_YELLOW
    );
    try {
        const recentProjects = await dbConnector.Projet.findAll({
            include: [
                {
                    model: dbConnector.Statut,
                    as: "statut",
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Statistique,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Categorie,
                    attributes: { exclude: ["id"] },
                },
                {
                    model: dbConnector.Utilisateur,
                    as: "utilisateur",
                    attributes: { exclude: ["roleId", "password"] },
                },
                {
                    model: dbConnector.ImageProjet,
                    as: "imageProjet",
                    attributes: { exclude: ["projetId"] }, // Exclude foreign key if not needed
                },
            ],
            where: { estvalide: true },
            "$statut.nom$": "Valide",
            attributes: {
                exclude: [
                    "statutId",
                    "statistiqueId",
                    "categorieId",
                    "utilisateurId",
                ],
            },
            order: [[dbConnector.Statistique, "datePublication", "ASC"]], // Trier par ordre croissant
            limit: 16,
        });

        logMessage(
            "Les 16 derniers projets créés récupérés avec succès",
            COLOR_GREEN
        );
        return res.status(200).json({ recentProjects });
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des derniers projets créés",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération des derniers projets créés :",
            error
        );
        return res.status(500).json({
            message:
                "Erreur lors de la récupération des derniers projets créés",
        });
    }
};

// Recherche de projet(s) par mot clé incluant la pagination
exports.search = async (req, res, next) => {
    logMessage(
        `Début de la recherche de projets avec le mot-clé : ${
            req.params.keyword || "Tous les projets"
        }`,
        COLOR_YELLOW
    );

    try {
        const { keyword = "", page = 1, limit = 10 } = req.params;
        const offset = (page - 1) * limit;

        // Filtre de recherche combiné pour les projets et les catégories
        const projectFilter =
            keyword && keyword !== "all"
                ? {
                      [Op.or]: [
                          { nom: { [Op.like]: `%${keyword}%` } },
                          { description: { [Op.like]: `%${keyword}%` } },
                          { "$categorie.nom$": { [Op.like]: `%${keyword}%` } }, // Filtre sur le nom de la catégorie
                      ],
                      estValide: true,
                      statutId: 1,
                  }
                : { estValide: true, statutId: 1 };

        // Log du filtre appliqué
        logMessage(
            `Filtre de recherche appliqué : ${JSON.stringify(projectFilter)}`,
            COLOR_YELLOW
        );

        // Requête pour obtenir le nombre total d'éléments
        const count = await dbConnector.Projet.count({
            where: projectFilter,
            include: [
                {
                    model: dbConnector.Categorie,
                    as: "categorie",
                    attributes: [],
                    required: true, // La catégorie est requise pour appliquer le filtre sur son nom
                },
            ],
        });

        // Si le nombre d'éléments est inférieur à l'offset, ajuster pour retourner une page vide
        if (offset >= count) {
            return res.status(200).json({
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                projects: [],
            });
        }

        // Requête pour obtenir les éléments paginés
        const rows = await dbConnector.Projet.findAll({
            where: projectFilter,
            include: [
                {
                    model: dbConnector.Categorie,
                    as: "categorie",
                    attributes: ["nom"],
                    required: true, // Inclure la catégorie pour chaque projet
                },
                {
                    model: dbConnector.Statut,
                    as: "statut",
                    attributes: [],
                    where: {
                        nom: "Valide",
                    },
                },
                {
                    model: dbConnector.Statistique,
                    attributes: [],
                },
                {
                    model: dbConnector.Utilisateur,
                    attributes: { exclude: ["id", "email"] },
                    as: "utilisateur",
                },
                {
                    model: dbConnector.ImageProjet,
                    as: "imageProjet",
                    attributes: ["nom", "dateCreation"],
                },
            ],
            attributes: {
                exclude: [
                    // Les attributs à exclure ici...
                ],
            },
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        // Log des résultats de la requête
        logMessage(
            `Nombre total d'éléments trouvés (count): ${count}`,
            COLOR_YELLOW
        );
        logMessage(
            `Nombre d'éléments récupérés pour la page (rows.length): ${rows.length}`,
            COLOR_YELLOW
        );

        return res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            projects: rows,
        });
    } catch (error) {
        logMessage("Erreur lors de la recherche des projets", COLOR_RED);
        console.error("Erreur lors de la recherche des projets :", error);
        return res
            .status(500)
            .json({ message: "Erreur lors de la recherche des projets" });
    }
};

// Récupérer les projets téléchargés par un utilisateur
exports.getDownloadedByUser = async (req, res, next) => {
    const userId = req.params.id;
    logMessage(
        `Début de la récupération des projets téléchargés pour l'utilisateur avec ID: ${userId}`,
        COLOR_YELLOW
    );

    try {
        // Récupérer tous les projets téléchargés par l'utilisateur via la table UtilisateurProjet
        const utilisateur = await dbConnector.Utilisateur.findByPk(userId, {
            include: [
                {
                    model: dbConnector.Projet,
                    as: "projetsTelecharges", // Utiliser l'alias défini dans l'association
                    include: [
                        {
                            model: dbConnector.Statut,
                            as: "statut",
                            attributes: { exclude: ["id"] },
                        },
                        {
                            model: dbConnector.Statistique,
                            attributes: [
                                "nombreApreciation",
                                "nombreTelechargement",
                                "datePublication",
                                "dateModification",
                            ],
                        },
                        {
                            model: dbConnector.Categorie,
                            attributes: ["nom"],
                        },
                        {
                            model: dbConnector.Utilisateur,
                            as: "utilisateur",
                            attributes: ["pseudo", "email"],
                            include: [
                                {
                                    model: dbConnector.ImageUtilisateur,
                                    as: "imageUtilisateur",
                                    attributes: ["nom"],
                                },
                            ],
                        },
                        {
                            model: dbConnector.ImageProjet,
                            as: "imageProjet",
                            attributes: ["nom"],
                        },
                    ],
                    attributes: {
                        exclude: [
                            "statutId",
                            "statistiqueId",
                            "categorieId",
                            "utilisateurId",
                        ],
                    },
                },
            ],
        });

        logMessage(
            `Projets téléchargés pour l'utilisateur avec ID: ${userId} récupérés avec succès`,
            COLOR_GREEN
        );
        return res.status(200).json(utilisateur.projetsTelecharges);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des projets téléchargés par utilisateurId",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération des projets téléchargés par utilisateurId :",
            error
        );
        return res.status(500).json({
            message: "Erreur lors de la récupération des projets téléchargés",
        });
    }
};
