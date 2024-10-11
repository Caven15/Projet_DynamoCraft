const dbConnector = require("../tools/ConnexionDb.tools").get();
const emailTools = require("../tools/email.tools");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const crypto = require("crypto");
const axios = require("axios");
const fs = require("fs");
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

exports.login = async (req, res, next) => {
    logMessage("Début de la connexion de l'utilisateur", COLOR_YELLOW);

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            logMessage("Tous les champs sont obligatoires", COLOR_RED);
            return res.status(400).json({
                message: "Email et mot de passe sont obligatoires",
            });
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

        if (!utilisateur.statutCompte) {
            logMessage("Compte désactivé", COLOR_RED);
            return res
                .status(403)
                .json({ message: "Compte désactivé. Contactez le support." });
        }

        if (!utilisateur.isActivated) {
            logMessage("Compte désactivé", COLOR_RED);
            return res
                .status(403)
                .json({ message: "Compte non activé. Consultez votre boite mail." });
        }

        logMessage("Comparaison du mot de passe", COLOR_YELLOW);
        const passwordMatch = bcrypt.compareSync(
            password.trim(),
            utilisateur.password
        );

        if (!passwordMatch) {
            logMessage("Mot de passe incorrect", COLOR_RED);
            utilisateur.loginAttempts += 1;

            if (utilisateur.loginAttempts >= 5) {
                utilisateur.lockUntil = Date.now() + 2 * 60 * 60 * 1000; // Verrouille pendant 2 heures
                logMessage("Compte verrouillé pour 2 heures", COLOR_RED);
                await emailTools.sendAccountLockEmail(utilisateur);
            }

            await utilisateur.save();
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        utilisateur.loginAttempts = 0;
        utilisateur.lockUntil = null;
        await utilisateur.save();

        logMessage("Génération du token JWT", COLOR_YELLOW);
        const dataToken = { id: utilisateur.id, roleId: utilisateur.roleId };
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
                .json({ message: "Tous les champs sont obligatoires." });
        }

        // Vérification de l'existence de l'email dans la base de données
        const utilisateurExistEmail = await dbConnector.Utilisateur.findOne({
            where: { email },
        });

        if (utilisateurExistEmail) {
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

        // Vérification de l'existence du pseudo dans la base de données
        const utilisateurExistPseudo = await dbConnector.Utilisateur.findOne({
            where: { pseudo },
        });

        if (utilisateurExistPseudo) {
            if (file) {
                fs.unlink(`./uploads/${file.filename}`, (err) => {
                    if (err) console.log(err);
                });
            }
            logMessage(
                "Le pseudo existe déjà dans le système",
                COLOR_RED
            );
            return res.status(403).json({
                message: "Le pseudo existe déjà dans le système",
            });
        }

        const hashedPassword = bcrypt.hashSync(password.trim(), 10);
        const userCount = await dbConnector.Utilisateur.count();
        const roleId = userCount === 0 ? 3 : 1; // 3 pour le premier utilisateur, 1 pour les suivants

        const newUtilisateur = await dbConnector.Utilisateur.create({
            pseudo,
            email,
            dateNaissance,
            biographie,
            password: hashedPassword,
            centreInterets,
            roleId: roleId,
        });

        if (file) {
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

        // Générer le token d'activation
        const token = jwt.sign(
            { id: newUtilisateur.id },
            process.env.TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        const activationUrl = `http://localhost:4200/auth/activate/${token}`;

        // Envoyer l'email d'activation
        await emailTools.sendActivationEmail(newUtilisateur, activationUrl);
        logMessage("E-mail d'activation envoyé avec succès", COLOR_GREEN);

        res.status(201).json({
            message:
                "Utilisateur enregistré avec succès, vérifiez votre e-mail pour activer votre compte.",
            utilisateurId: newUtilisateur.id,
        });
    } catch (error) {
        logMessage(
            "Erreur lors de l'enregistrement de l'utilisateur",
            COLOR_RED
        );
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de l'enregistrement de l'utilisateur.",
        });
    }
};


exports.activateAccount = async (req, res) => {
    const { token } = req.params;

    try {
        logMessage(
            "Vérification du token JWT pour l'activation du compte",
            COLOR_YELLOW
        );

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const utilisateur = await dbConnector.Utilisateur.findByPk(decoded.id);

        if (!utilisateur) {
            logMessage("Utilisateur non trouvé", COLOR_RED);
            return res.status(400).json({ message: "Utilisateur non trouvé." });
        }

        if (utilisateur.isActivated) {  // Utilisation de isActivated
            logMessage("Le compte est déjà activé", COLOR_RED);
            return res
                .status(400)
                .json({ message: "Le compte est déjà activé." });
        }

        utilisateur.isActivated = true;  // Activation du compte
        await utilisateur.save();

        logMessage("Compte activé avec succès", COLOR_GREEN);
        res.status(200).json({ message: "Compte activé avec succès." });
    } catch (error) {
        logMessage(
            "Erreur lors de la vérification du token ou de l'activation",
            COLOR_RED
        );
        console.error("Erreur d'activation de compte:", error);
        res.status(400).json({
            message: "Lien d'activation invalide ou expiré.",
        });
    }
};

exports.resendActivationLink = async (req, res) => {
    const { email } = req.body;

    try {
        // Vérifier si l'utilisateur existe
        const utilisateur = await dbConnector.Utilisateur.findOne({
            where: { email },
        });

        if (!utilisateur) {
            logMessage("Utilisateur non trouvé", COLOR_RED);
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        // Vérifier si le compte est déjà activé
        if (utilisateur.statutCompte) {
            logMessage("Le compte est déjà activé", COLOR_RED);
            return res
                .status(400)
                .json({ message: "Le compte est déjà activé." });
        }

        // Générer un nouveau token JWT pour l'activation
        const token = jwt.sign(
            { id: utilisateur.id },
            process.env.TOKEN_SECRET,
            { expiresIn: "1h" }
        );
        const activationUrl = `http://localhost:4200/auth/activate/${token}`;

        // Envoyer l'email de renvoi d'activation avec le nouveau corps
        await emailTools.sendResendActivationEmail(utilisateur, activationUrl);
        logMessage(
            "E-mail de renvoi d'activation envoyé avec succès",
            COLOR_GREEN
        );

        res.status(200).json({
            message:
                "Lien d'activation renvoyé avec succès. Vérifiez votre boîte mail.",
        });
    } catch (error) {
        logMessage("Erreur lors de l'envoi du lien d'activation", COLOR_RED);
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de l'envoi du lien d'activation.",
        });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "L'email est requis" });
    }

    try {
        const utilisateur = await dbConnector.Utilisateur.findOne({
            where: { email },
        });

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const token = crypto.randomBytes(20).toString("hex");
        const expires = Date.now() + 3600000; // 1 heure
        utilisateur.resetPasswordToken = token;
        utilisateur.resetPasswordExpires = expires;

        await utilisateur.save();
        const resetUrl = `http://localhost:4200/auth/reset-mot-de-passe-oublie/${token}`;

        // Envoyer l'email de réinitialisation de mot de passe
        await emailTools.sendResetPasswordEmail(utilisateur, resetUrl);
        res.status(200).json({
            message: "Email de réinitialisation du mot de passe envoyé.",
        });
    } catch (error) {
        logMessage(
            "Erreur lors de la demande de réinitialisation de mot de passe",
            COLOR_RED
        );
        console.error(error);
        res.status(500).json({
            message:
                "Erreur lors de la demande de réinitialisation de mot de passe.",
        });
    }
};

exports.resetPassword = async (req, res, next) => {
    logMessage("Début de la réinitialisation du mot de passe", COLOR_YELLOW);

    try {
        const { oldPassword, newPassword } = req.body;
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.id;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message:
                    "L'ancien et le nouveau mot de passe sont obligatoires",
            });
        }

        const utilisateur = await dbConnector.Utilisateur.findOne({
            where: { id: userId },
        });

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const passwordMatch = bcrypt.compareSync(
            oldPassword.trim(),
            utilisateur.password
        );

        if (!passwordMatch) {
            return res
                .status(401)
                .json({ message: "L'ancien mot de passe est incorrect" });
        }

        const hashedPassword = bcrypt.hashSync(newPassword.trim(), 10);
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

exports.resetForgotPassword = async (req, res, next) => {
    logMessage(
        "Début de la réinitialisation du mot de passe via token",
        COLOR_YELLOW
    );

    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                message:
                    "Le token et le nouveau mot de passe sont obligatoires",
            });
        }

        const utilisateur = await dbConnector.Utilisateur.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() },
            },
        });

        if (!utilisateur) {
            return res
                .status(400)
                .json({ message: "Token invalide ou expiré" });
        }

        const passwordComplexityRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordComplexityRegex.test(newPassword)) {
            return res.status(400).json({
                message:
                    "Le mot de passe doit comporter au moins 8 caractères, avec une lettre majuscule, une lettre minuscule, un chiffre et un symbole spécial.",
            });
        }

        const hashedPassword = bcrypt.hashSync(newPassword.trim(), 10);
        utilisateur.password = hashedPassword;
        utilisateur.resetPasswordToken = null;
        utilisateur.resetPasswordExpires = null;

        await utilisateur.save();

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
