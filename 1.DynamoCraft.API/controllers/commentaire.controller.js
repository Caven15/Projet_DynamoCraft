const dbConnector = require("../tools/ConnexionDb.tools").get();
const jwt = require("jsonwebtoken");
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

// Créer un commentaire
exports.create = async (req, res, next) => {
    logMessage("Début de la création du commentaire", COLOR_YELLOW);

    try {
        const { description, projetId } = req.body;

        if (!description || !projetId) {
            logMessage(
                "La description et le projet sont obligatoires",
                COLOR_RED
            );
            return res.status(400).json({
                message: "La description et le projet sont obligatoires",
            });
        }

        // Extraire l'utilisateur du token JWT
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const utilisateurId = decodedToken.id;

        // Vérifier si le projet existe
        logMessage(
            `Vérification de l'existence du projet avec ID: ${projetId}`,
            COLOR_YELLOW
        );
        const projet = await dbConnector.Projet.findByPk(projetId);
        if (!projet) {
            logMessage("Projet non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        // Créer le commentaire
        logMessage("Création du commentaire", COLOR_YELLOW);
        const newCommentaire = await dbConnector.Commentaire.create({
            description,
            dateCreation: new Date(),
            dateModif: new Date(),
            projetId,
            utilisateurId,
        });

        logMessage("Commentaire créé avec succès", COLOR_GREEN);
        res.status(201).json({
            message: "Commentaire créé avec succès",
            commentaire: newCommentaire,
        });
    } catch (error) {
        logMessage("Erreur lors de la création du commentaire", COLOR_RED);
        console.error("Erreur lors de la création du commentaire :", error);
        res.status(500).json({
            message: "Erreur lors de la création du commentaire",
        });
    }
};

// Récupérer tous les commentaires par projetID
exports.getByProjectId = async (req, res, next) => {
    logMessage(
        "Début de la récupération des commentaires par projet ID",
        COLOR_YELLOW
    );

    try {
        const id = req.params.id;

        // Vérifier si le projet existe
        logMessage(
            `Vérification de l'existence du projet avec ID: ${id}`,
            COLOR_YELLOW
        );
        const projet = await dbConnector.Projet.findByPk(id);
        if (!projet) {
            logMessage("Projet non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        // Récupérer les commentaires associés au projet avec les utilisateurs (sans l'image)
        logMessage(
            "Récupération des commentaires associés au projet avec les utilisateurs",
            COLOR_YELLOW
        );
        const commentaires = await dbConnector.Commentaire.findAll({
            where: { projetId: id },
            include: [
                { model: dbConnector.Projet, as: "projet" },
                {
                    model: dbConnector.Utilisateur,
                    as: "utilisateur",
                    attributes: ["id", "pseudo"],
                },
            ],
        });

        logMessage("Commentaires récupérés avec succès", COLOR_GREEN);
        res.status(200).json({ commentaires });
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des commentaires par projet ID",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération des commentaires par projet ID :",
            error
        );
        res.status(500).json({
            message:
                "Erreur lors de la récupération des commentaires par projet ID",
        });
    }
};

// Mettre à jour un commentaire par ID
exports.update = async (req, res, next) => {
    logMessage("Début de la mise à jour du commentaire", COLOR_YELLOW);

    try {
        const { description } = req.body;
        const commentaireId = req.params.id;

        // Extraire l'utilisateur du token JWT
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const utilisateurId = decodedToken.id;

        // Vérifier si le commentaire existe
        logMessage(
            `Vérification de l'existence du commentaire avec ID: ${commentaireId}`,
            COLOR_YELLOW
        );
        const commentaire = await dbConnector.Commentaire.findByPk(
            commentaireId
        );
        if (!commentaire) {
            logMessage("Commentaire non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }

        // Vérifier si l'utilisateur est le titulaire du commentaire
        if (commentaire.utilisateurId !== utilisateurId && decodedToken.role < 2) {
            logMessage(
                "Utilisateur non autorisé à mettre à jour ce commentaire",
                COLOR_RED
            );
            return res.status(403).json({
                message:
                    "Vous n'êtes pas autorisé à mettre à jour ce commentaire",
            });
        }

        // Mettre à jour le commentaire
        logMessage("Mise à jour du commentaire", COLOR_YELLOW);
        await commentaire.update({
            description,
            dateModif: new Date(),
        });

        logMessage(
            `Commentaire ${commentaireId} mis à jour avec succès`,
            COLOR_GREEN
        );
        res.status(200).json({
            message: `Commentaire ${commentaireId} mis à jour avec succès !`,
        });
    } catch (error) {
        logMessage("Erreur lors de la mise à jour du commentaire", COLOR_RED);
        console.error("Erreur lors de la mise à jour du commentaire :", error);
        res.status(500).json({
            message: "Erreur lors de la mise à jour du commentaire",
        });
    }
};

// Supprimer un commentaire par ID
exports.delete = async (req, res, next) => {
    logMessage("Début de la suppression du commentaire", COLOR_YELLOW);

    try {
        const commentaireId = req.params.id;

        // Extraire l'utilisateur du token JWT
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const utilisateurId = decodedToken.id;

        // Vérifier si le commentaire existe
        logMessage(
            `Vérification de l'existence du commentaire avec ID: ${commentaireId}`,
            COLOR_YELLOW
        );
        const commentaire = await dbConnector.Commentaire.findByPk(
            commentaireId
        );
        if (!commentaire) {
            logMessage("Commentaire non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Commentaire non trouvé" });
        }

        // Vérifier si l'utilisateur est le titulaire du commentaire
        if (commentaire.utilisateurId !== utilisateurId && decodedToken.role < 2) {
            logMessage(
                "Utilisateur non autorisé à supprimer ce commentaire",
                COLOR_RED
            );
            return res.status(403).json({
                message: "Vous n'êtes pas autorisé à supprimer ce commentaire",
            });
        }

        // Supprimer le commentaire
        logMessage("Suppression du commentaire", COLOR_YELLOW);
        await commentaire.destroy();

        logMessage(
            `Commentaire ${commentaireId} supprimé avec succès`,
            COLOR_GREEN
        );
        res.status(200).json({
            message: `Commentaire ${commentaireId} supprimé avec succès !`,
        });
    } catch (error) {
        logMessage("Erreur lors de la suppression du commentaire", COLOR_RED);
        console.error("Erreur lors de la suppression du commentaire :", error);
        res.status(500).json({
            message: "Erreur lors de la suppression du commentaire",
        });
    }
};

// Récupérer tous les commentaires postés par un utilisateur
exports.getByUserId = async (req, res, next) => {
    logMessage(
        "Début de la récupération des commentaires par utilisateur ID",
        COLOR_YELLOW
    );

    try {
        // Extraire l'utilisateur du token JWT
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const utilisateurId = decodedToken.id;

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

        // Récupérer les commentaires associés à l'utilisateur
        logMessage(
            "Récupération des commentaires associés à l'utilisateur",
            COLOR_YELLOW
        );
        const commentaires = await dbConnector.Commentaire.findAll({
            where: { utilisateurId },
            include: [
                {
                    model: dbConnector.Projet,
                    as: "projet",
                    attributes: ["id", "nom"], // Inclure seulement les champs nécessaires
                },
            ],
        });

        logMessage("Commentaires récupérés avec succès", COLOR_GREEN);
        res.status(200).json({ commentaires });
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des commentaires par utilisateur ID",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération des commentaires par utilisateur ID :",
            error
        );
        res.status(500).json({
            message:
                "Erreur lors de la récupération des commentaires par utilisateur ID",
        });
    }
};
