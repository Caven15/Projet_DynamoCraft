const dbConnector = require("../tools/ConnexionDb.tools").get();
const nodemailer = require("nodemailer");
const axios = require("axios");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const fs = require("fs");
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

// Configurer Nodemailer avec Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

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

        // Envoyer un email de remerciement à l'utilisateur
        logMessage(`Envoi d'un email de remerciement à l'utilisateur : ${email}`, COLOR_YELLOW);
        await transporter.sendMail({
            from: `"DynamoCraft" <${process.env.EMAIL_USER}>`, // Adresse d'expéditeur
            to: email, // Adresse de l'utilisateur nouvellement inscrit
            subject: "Bienvenue sur DynamoCraft",
            html: `
                <p>Bonjour ${pseudo},</p>
                <p>Merci de vous être inscrit sur DynamoCraft ! Nous sommes ravis de vous compter parmi notre communauté.</p>
                <p>Vous pouvez dès à présent explorer nos projets et partager les vôtres.</p>
                <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
                <p>Meilleures salutations,</p>
                <p>L'équipe DynamoCraft</p>
            `,
        });

        logMessage("Email de remerciement envoyé avec succès", COLOR_GREEN);

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
        const { email, password, recaptchaToken } = req.body;

        if (!email || !password || !recaptchaToken) {
            logMessage(
                "Tous les champs sont obligatoires, y compris le captcha",
                COLOR_RED
            );
            return res
                .status(400)
                .json({
                    message:
                        "Email, mot de passe, et captcha sont obligatoires",
                });
        }

        // Valider le reCAPTCHA
        const secretKey = process.env.SECRET_CAPTCHA;
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
        const captchaResponse = await axios.post(verificationUrl);
        if (!captchaResponse.data.success) {
            logMessage("Échec de la validation du reCAPTCHA", COLOR_RED);
            return res
                .status(400)
                .json({ message: "Échec de la validation du Captcha" });
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

        // Vérifiez si l'utilisateur est verrouillé
        if (utilisateur.lockUntil && utilisateur.lockUntil > Date.now()) {
            logMessage(
                "Compte verrouillé en raison de tentatives infructueuses",
                COLOR_RED
            );
            return res
                .status(403)
                .json({ message: "Compte verrouillé. Réessayez plus tard." });
        }

        logMessage("Comparaison du mot de passe", COLOR_YELLOW);
        const passwordMatch = bcrypt.compareSync(
            password.trim(),
            utilisateur.password
        );

        if (!passwordMatch) {
            logMessage("Mot de passe incorrect", COLOR_RED);

            // Incrémenter loginAttempts
            utilisateur.loginAttempts += 1;

            // Vérifier si les tentatives dépassent le seuil
            if (utilisateur.loginAttempts >= 5) {
                utilisateur.lockUntil = Date.now() + 2 * 60 * 60 * 1000; // Verrouille pendant 2 heures
                logMessage(
                    "Trop de tentatives infructueuses, compte verrouillé pour 2 heures",
                    COLOR_RED
                );

                // Envoyer un email à l'utilisateur pour l'informer du verrouillage
                const mailOptions = {
                    to: utilisateur.email,
                    from: process.env.EMAIL_USER,
                    subject: "Votre compte est temporairement verrouillé",
                    html: `
                        <p>Bonjour ${utilisateur.pseudo},</p>
                        <p>Votre compte a été verrouillé pendant 2 heures en raison de plusieurs tentatives de connexion échouées.</p>
                        <p>Si vous n'êtes pas à l'origine de ces tentatives, veuillez contacter notre support via le <a href="http://yourfrontenddomain.com/contact">formulaire de contact</a>.</p>
                        <p>Merci de votre compréhension.</p>
                        <p>Cordialement,</p>
                        <p>L'équipe Support</p>
                    `,
                };

                await transporter.sendMail(mailOptions);
                logMessage(
                    "Email de notification de verrouillage envoyé à l'utilisateur",
                    COLOR_GREEN
                );
            }

            await utilisateur.save();

            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // Si le mot de passe est correct, réinitialiser les tentatives et déverrouiller le compte
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

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "L'email est requis" });
    }

    try {
        // Rechercher l'utilisateur dans la base de données
        const utilisateur = await dbConnector.Utilisateur.findOne({
            where: { email },
        });

        if (!utilisateur) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Générer un token unique
        const token = crypto.randomBytes(20).toString("hex");

        // Définir l'expiration du token à 1 heure
        const expires = Date.now() + 3600000; // 1 heure

        // Mettre à jour l'utilisateur avec le token et la date d'expiration
        utilisateur.resetPasswordToken = token;
        utilisateur.resetPasswordExpires = expires;

        await utilisateur.save();

        // Envoyer l'email avec le lien de réinitialisation
        const resetUrl = `http://localhost:4200/auth/reset-mot-de-passe-oublie/${token}`;

        const mailOptions = {
            to: utilisateur.email,
            from: process.env.EMAIL_USER,
            subject: "Réinitialisation du mot de passe",
            html: `
                <p>Vous recevez cet email parce que vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.</p>
                <p>Veuillez cliquer sur le lien suivant ou le copier dans votre navigateur pour compléter le processus :</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et votre mot de passe restera inchangé.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Email de réinitialisation du mot de passe envoyé.",
        });
    } catch (error) {
        console.error(
            "Erreur lors de la demande de réinitialisation de mot de passe:",
            error
        );
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

        // Extraire l'utilisateur du token JWT
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.id;

        if (!oldPassword || !newPassword) {
            logMessage(
                "L'ancien et le nouveau mot de passe sont obligatoires",
                COLOR_RED
            );
            return res.status(400).json({
                message: "L'ancien et le nouveau mot de passe sont obligatoires",
            });
        }

        logMessage(`Vérification de l'existence de l'utilisateur avec ID: ${userId}`, COLOR_YELLOW);
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
            return res.status(401).json({ message: "L'ancien mot de passe est incorrect" });
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
        logMessage("Erreur lors de la réinitialisation du mot de passe", COLOR_RED);
        console.error(error);
        res.status(500).json({
            message: "Erreur lors de la réinitialisation du mot de passe",
        });
    }
};

exports.resetForgotPassword = async (req, res, next) => {
    logMessage("Début de la réinitialisation du mot de passe", COLOR_YELLOW);

    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            logMessage(
                "Le token et le nouveau mot de passe sont obligatoires",
                COLOR_RED
            );
            return res.status(400).json({
                message:
                    "Le token et le nouveau mot de passe sont obligatoires",
            });
        }

        logMessage(`Vérification du token: ${token}`, COLOR_YELLOW);

        // Rechercher l'utilisateur en fonction du token et vérifier l'expiration
        const utilisateur = await dbConnector.Utilisateur.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() }, // Le token doit être non expiré
            },
        });

        if (!utilisateur) {
            logMessage("Token invalide ou expiré", COLOR_RED);
            return res
                .status(400)
                .json({ message: "Token invalide ou expiré" });
        }

        // Vérification de la complexité du mot de passe
        const passwordComplexityRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordComplexityRegex.test(newPassword)) {
            logMessage(
                "Le nouveau mot de passe ne respecte pas les exigences de complexité",
                COLOR_RED
            );
            return res.status(400).json({
                message:
                    "Le mot de passe doit comporter au moins 8 caractères, avec une lettre majuscule, une lettre minuscule, un chiffre et un symbole spécial.",
            });
        }

        logMessage("Hachage du nouveau mot de passe", COLOR_YELLOW);
        const hashedPassword = bcrypt.hashSync(newPassword.trim(), 10);

        // Mise à jour du mot de passe et suppression du token de réinitialisation
        utilisateur.password = hashedPassword;
        utilisateur.resetPasswordToken = null;
        utilisateur.resetPasswordExpires = null;

        await utilisateur.save();

        // Envoi d'un email de confirmation de la réinitialisation du mot de passe
        const mailOptions = {
            to: utilisateur.email,
            from: process.env.EMAIL_USER,
            subject: "Votre mot de passe a été réinitialisé",
            html: `
                <p>Bonjour ${utilisateur.pseudo},</p>
                <p>Votre mot de passe a été réinitialisé avec succès.</p>
                <p>Si vous n'êtes pas à l'origine de cette action, veuillez nous contacter immédiatement.</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        logMessage(
            "Mot de passe réinitialisé avec succès et email de confirmation envoyé",
            COLOR_GREEN
        );
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
