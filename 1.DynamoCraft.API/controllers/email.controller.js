const nodemailer = require("nodemailer");
const axios = require('axios');
const dotenv = require("dotenv");
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

// Charger les variables d'environnement
dotenv.config();

// Configurer Nodemailer avec Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Fonction pour envoyer un email
exports.contact = async (req, res) => {
    logMessage("Début du traitement du formulaire de contact", COLOR_YELLOW);
    const { email, subject, message, recaptchaToken } = req.body;

    if (!email || !subject || !message) {
        logMessage("Tous les champs sont obligatoires", COLOR_RED);
        return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    // Valider le token reCAPTCHA
    const secretKey = process.env.SECRET_CAPTCHA; 
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

    try {
        const response = await axios.post(verificationUrl);
        if (response.data.success) {
            logMessage(`Envoi du message à l'adresse administrateur : ${process.env.EMAIL_USER}`, COLOR_YELLOW);

            // Envoyer l'email à l'administrateur ou à une adresse spécifique
            await transporter.sendMail({
                from: `"Contact Form" <${process.env.EMAIL_USER}>`, // Adresse d'expéditeur
                to: `${process.env.EMAIL_USER}`, // Adresse de réception
                subject: subject,
                text: message,
                html: `<p>${message}</p><br/><p>Envoyé par : ${email}</p>`,
            });

            logMessage("Email envoyé avec succès à l'administrateur", COLOR_GREEN);

            // Réponse automatique à l'expéditeur
            logMessage(`Envoi de la réponse automatique à l'expéditeur : ${email}`, COLOR_YELLOW);
            await transporter.sendMail({
                from: `"Support" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Merci pour votre message",
                html: `
                    <p>Bonjour,</p>
                    <p>Nous vous remercions d'avoir pris le temps de nous contacter.</p>
                    <p>Nous avons bien reçu votre message concernant : "${subject}".</p>
                    <p>Nous examinerons votre demande avec attention et reviendrons vers vous dans les plus brefs délais.</p>
                    <p>Merci pour votre patience.</p>
                    <p>Meilleures salutations,</p>
                    <p>L'équipe Support</p>
                `,
            });

            logMessage("Réponse automatique envoyée avec succès", COLOR_GREEN);
            res.status(200).json({
                message: "Email envoyé et réponse automatique envoyée.",
            });
        } else {
            logMessage("Échec de la validation du reCAPTCHA", COLOR_RED);
            res.status(400).json({ message: "Échec de la validation du Captcha." });
        }
    } catch (error) {
        logMessage("Erreur lors de la vérification du reCAPTCHA ou de l'envoi de l'email", COLOR_RED);
        console.error("Erreur lors de la vérification du reCAPTCHA ou de l'envoi de l'email:", error);
        res.status(500).json({ message: "Erreur lors de l'envoi de l'email." });
    }
};
