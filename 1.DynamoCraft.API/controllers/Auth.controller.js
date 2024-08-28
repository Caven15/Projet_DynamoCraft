const dbConnector = require("../tools/ConnexionDb.tools").get();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

exports.register = async (req, res, next) => {
    logMessage("Début de l'enregistrement de l'utilisateur", COLOR_YELLOW);

    try {
        const {
            pseudo,
            email,
            dateNaissance,
            biographie,
            password,
            centreInterets,
        } = req.body;
        const { file } = req;

        if (
            !pseudo ||
            !email ||
            !dateNaissance ||
            !biographie ||
            !password ||
            !centreInterets
        ) {
            logMessage("Tous les champs sont obligatoires", COLOR_RED);
            return res
                .status(400)
                .json({ message: "Tous les champs sont obligatoires" });
        }

        logMessage(
            `Vérification de l'existence de l'utilisateur avec email: ${email}`,
            COLOR_YELLOW
        );
        const utilisateurExist = await dbConnector.Utilisateur.findOne({
            where: { email },
        });

        if (utilisateurExist) {
            if (file) {
                fs.unlink(`./uploads/${file.filename}`, (err) => {
                    if (err) console.log(err);
                });
            }
            logMessage(
                "L'adresse e-mail existe déjà dans le système",
                COLOR_RED
            );
            return res.status(403).json({
                message: "L'adresse e-mail existe déjà dans le système",
            });
        }

        logMessage("Hachage du mot de passe", COLOR_YELLOW);
        const hashedPassword = bcrypt.hashSync(password.trim(), 10);

        logMessage(
            "Vérification du nombre d'utilisateurs existants",
            COLOR_YELLOW
        );
        const userCount = await dbConnector.Utilisateur.count();
        const roleId = userCount === 0 ? 3 : 1; // 3 pour le premier utilisateur, 1 pour les suivants

        logMessage("Création de l'utilisateur", COLOR_YELLOW);
        const newUtilisateur = await dbConnector.Utilisateur.create({
            pseudo,
            email,
            dateNaissance,
            biographie,
            password: hashedPassword,
            centreInterets,
            roleId: roleId, // Utiliser roleId calculé
            statutCompte: true,
        });

        if (file) {
            logMessage("Ajout de l'image de l'utilisateur", COLOR_YELLOW);
            const newImageUtilisateur =
                await dbConnector.ImageUtilisateur.create({
                    nom: file.filename,
                    utilisateurId: newUtilisateur.id,
                });

            await dbConnector.Utilisateur.update(
                { imageId: newImageUtilisateur.id },
                { where: { id: newUtilisateur.id } }
            );
        }

        logMessage("Utilisateur enregistré avec succès", COLOR_GREEN);
        res.status(201).json({
            message: "Utilisateur enregistré avec succès",
            utilisateurId: newUtilisateur.id,
        });
    } catch (error) {
        logMessage(
            "Erreur lors de l'enregistrement de l'utilisateur",
            COLOR_RED
        );
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de l'enregistrement de l'utilisateur",
        });
    }
};

exports.login = async (req, res, next) => {
    logMessage("Début de la connexion de l'utilisateur", COLOR_YELLOW);

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            logMessage("Email et mot de passe sont obligatoires", COLOR_RED);
            return res
                .status(400)
                .json({ message: "Email et mot de passe sont obligatoires" });
        }

        logMessage(
            `Vérification de l'existence de l'utilisateur avec email: ${email}`,
            COLOR_YELLOW
        );
        const utilisateur = await dbConnector.Utilisateur.findOne({
            where: { email },
        });

        if (!utilisateur) {
            logMessage("Cette adresse email n'existe pas", COLOR_RED);
            return res
                .status(403)
                .json({ message: "Cette adresse email n'existe pas" });
        }

        logMessage("Comparaison du mot de passe", COLOR_YELLOW);
        const passwordMatch = bcrypt.compareSync(
            password.trim(),
            utilisateur.password
        );

        if (!passwordMatch) {
            logMessage("Mot de passe incorrect", COLOR_RED);
            return res.status(403).json({ message: "Mot de passe incorrect" });
        }

        logMessage("Génération du token JWT", COLOR_YELLOW);
        const dataToken = {
            id: utilisateur.id,
            roleId: utilisateur.roleId,
        };

        const token = jwt.sign(dataToken, process.env.TOKEN_SECRET, {
            expiresIn: parseInt(process.env.TOKEN_LIFE),
        });

        logMessage("Connexion réussie", COLOR_GREEN);
        res.status(202).json({
            accessToken: token,
            id: utilisateur.id,
            roleId: utilisateur.roleId,
        });
    } catch (error) {
        logMessage("Erreur lors de la connexion de l'utilisateur", COLOR_RED);
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de la connexion de l'utilisateur",
        });
    }
};

exports.resetPassword = async (req, res, next) => {
    logMessage("Début de la réinitialisation du mot de passe", COLOR_YELLOW);

    try {
        const { oldPassword, newPassword, userId } = req.body; // Gestion de l'userId par token a l'ajout de la sécurité

        if (!oldPassword || !newPassword) {
            logMessage(
                "L'ancien et le nouveau mot de passe sont obligatoires",
                COLOR_RED
            );
            return res.status(400).json({
                message:
                    "L'ancien et le nouveau mot de passe sont obligatoires",
            });
        }

        logMessage(
            `Vérification de l'existence de l'utilisateur avec ID: ${userId}`,
            COLOR_YELLOW
        );
        const utilisateur = await dbConnector.Utilisateur.findOne({
            where: { id: userId },
        });

        if (!utilisateur) {
            logMessage("Utilisateur non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        logMessage("Comparaison du mot de passe actuel", COLOR_YELLOW);
        const passwordMatch = bcrypt.compareSync(
            oldPassword.trim(),
            utilisateur.password
        );

        if (!passwordMatch) {
            logMessage("L'ancien mot de passe est incorrect", COLOR_RED);
            return res
                .status(403)
                .json({ message: "L'ancien mot de passe est incorrect" });
        }

        logMessage("Hachage du nouveau mot de passe", COLOR_YELLOW);
        const hashedPassword = bcrypt.hashSync(newPassword.trim(), 10);

        logMessage("Mise à jour du mot de passe", COLOR_YELLOW);
        await dbConnector.Utilisateur.update(
            { password: hashedPassword },
            { where: { id: userId } }
        );

        logMessage("Mot de passe réinitialisé avec succès", COLOR_GREEN);
        res.status(200).json({
            message: "Mot de passe réinitialisé avec succès",
        });
    } catch (error) {
        logMessage(
            "Erreur lors de la réinitialisation du mot de passe",
            COLOR_RED
        );
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de la réinitialisation du mot de passe",
        });
    }
};