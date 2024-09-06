const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

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

// Fonction pour générer un e-mail avec votre palette de couleurs
function generateEmailTemplate(subject, bodyContent) {
    return `
    <div style="font-family: Arial, sans-serif; background-color: rgb(35, 35, 35); padding: 20px; color: #fff;">
        <div style="max-width: 600px; margin: 0 auto; background-color: rgb(25, 25, 25); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
            
            <!-- En-tête -->
            <div style="background-color: rgb(35, 35, 35); padding: 20px; text-align: center;">
                <h1 style="color: rgb(227, 178, 0); font-size: 24px; margin: 0;">${subject}</h1>
            </div>
            
            <!-- Contenu principal -->
            <div style="padding: 20px; line-height: 1.6; color: #fff;">
                ${bodyContent}
            </div>
            
            <!-- Bas de page -->
            <div style="background-color: rgb(25, 25, 25); padding: 20px; text-align: center; font-size: 12px; color: #777;">
                <p>© 2024 DynamoCraft. Tous droits réservés.</p>
                <p><a href="http://localhost:4200/politiqueConfidentialite" style="color: rgb(227, 178, 0); text-decoration: none;">Politique de confidentialité</a> | <a href="http://localhost:4200/conditionsUtilisation" style="color: rgb(227, 178, 0); text-decoration: none;">Conditions d'utilisation</a></p>
            </div>
        </div>
    </div>
    `;
}

// Fonction pour envoyer un email
async function sendEmail(to, subject, bodyContent) {
    const htmlContent = generateEmailTemplate(subject, bodyContent);
    transporter.verify(function (error, success) {
        if (error) {
            console.log("Erreur de connexion:", error);
        } else {
            console.log("Connexion réussie, prêt à envoyer des emails!");
            transporter.sendMail(
                {
                    from: `"DynamoCraft" <${process.env.EMAIL_USER}>`,
                    to,
                    subject,
                    html: htmlContent,
                },
                (err, info) => {
                    if (err) {
                        console.error(
                            "Erreur lors de l'envoi de l'email:",
                            err
                        );
                    } else {
                        console.log("Email envoyé avec succès:", info.response);
                    }
                }
            );
        }
    });
}

// Email d'activation de compte
async function sendActivationEmail(user, activationUrl) {
    const subject = "Activation de votre compte";
    const bodyContent = `
        <p>Bonjour ${user.pseudo},</p>
        <p>Merci de vous être inscrit sur DynamoCraft.</p>
        <p>Cliquez sur le lien ci-dessous pour activer votre compte :</p>
        <p><a href="${activationUrl}" style="display: inline-block; background-color: rgb(227, 178, 0); padding: 10px 20px; color: #ffffff; text-decoration: none; border-radius: 5px;">Activer mon compte</a></p>
        <p>Ce lien est valide pendant 1 heure.</p>
        <p>Si vous avez des questions, n'hésitez pas à <a href="mailto:support@dynamocraft.com" style="color: rgb(227, 178, 0);">contacter notre support</a>.</p>
    `;
    await sendEmail(user.email, subject, bodyContent);
}

// Email de renvoi du lien d'activation
async function sendResendActivationEmail(user, activationUrl) {
    const subject = "Renvoyé : Activation de votre compte";
    const bodyContent = `
        <p>Bonjour ${user.pseudo},</p>
        <p>Nous avons remarqué que vous n'avez pas encore activé votre compte sur DynamoCraft.</p>
        <p>Cliquez sur le lien ci-dessous pour activer votre compte :</p>
        <p><a href="${activationUrl}" style="display: inline-block; background-color: rgb(227, 178, 0); padding: 10px 20px; color: #ffffff; text-decoration: none; border-radius: 5px;">Activer mon compte</a></p>
        <p>Ce lien est valide pendant 1 heure.</p>
        <p>Si vous n'avez pas demandé cet e-mail, veuillez nous en informer en <a href="mailto:support@dynamocraft.com" style="color: rgb(227, 178, 0);">contactant notre support</a>.</p>
        <p>Merci de votre attention.</p>
    `;
    await sendEmail(user.email, subject, bodyContent);
}

module.exports = {
    sendActivationEmail,
    sendResetPasswordEmail,
    sendAccountLockEmail,
    sendResendActivationEmail, // Ajout de la nouvelle méthode ici
};

// Email de réinitialisation de mot de passe
async function sendResetPasswordEmail(user, resetUrl) {
    const subject = "Réinitialisation du mot de passe";
    const bodyContent = `
        <p>Bonjour ${user.pseudo},</p>
        <p>Vous avez demandé une réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <p><a href="${resetUrl}" style="display: inline-block; background-color: rgb(227, 178, 0); padding: 10px 20px; color: #ffffff; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a></p>
        <p>Ce lien est valide pendant 1 heure.</p>
        <p>Si vous avez des questions, n'hésitez pas à <a href="mailto:support@dynamocraft.com" style="color: rgb(227, 178, 0);">contacter notre support</a>.</p>
    `;
    await sendEmail(user.email, subject, bodyContent);
}

// Email de notification de verrouillage de compte
async function sendAccountLockEmail(user) {
    const subject = "Votre compte est temporairement verrouillé";
    const bodyContent = `
        <p>Bonjour ${user.pseudo},</p>
        <p>Votre compte a été verrouillé pendant 2 heures en raison de plusieurs tentatives de connexion échouées.</p>
        <p>Si vous n'êtes pas à l'origine de ces tentatives, veuillez <a href="mailto:support@dynamocraft.com" style="color: rgb(227, 178, 0);">contacter notre support</a> immédiatement.</p>
    `;
    await sendEmail(user.email, subject, bodyContent);
}

module.exports = {
    sendActivationEmail,
    sendResetPasswordEmail,
    sendAccountLockEmail,
    sendResendActivationEmail
};