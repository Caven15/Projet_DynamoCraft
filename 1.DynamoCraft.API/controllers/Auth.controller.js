// controllers/authController.js
const dbConnector = require("../tools/ConnexionDb.tools").get();
const bcrypt = require('bcrypt');
const fs = require('fs');

exports.register = async (req, res, next) => {
    try {
        const { nom, prenom, dateNaissance, numeroRue, rue, ville, codePostal, email, password, pseudo, biographie, centreInterets } = req.body;
        const { file } = req;

        if (!nom || !prenom || !dateNaissance || !numeroRue || !rue || !ville || !codePostal || !email || !password || !pseudo || !biographie || !centreInterets) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
        }

        const utilisateurExist = await dbConnector.Utilisateur.findOne({ where: { email } });

        if (utilisateurExist) {
            if (file) {
                fs.unlink(`./uploads/${file.filename}`, (err) => {
                    if (err) console.log(err);
                });
            }
            return res.status(403).json({ message: "L'adresse e-mail existe déjà dans le système" });
        }

        const hashedPassword = bcrypt.hashSync(password.trim(), 10);

        const newUtilisateur = await dbConnector.Utilisateur.create({
            nom,
            prenom,
            dateNaissance,
            numeroRue,
            rue,
            ville,
            codePostal,
            email,
            password: hashedPassword,
            pseudo,
            biographie,
            centreInterets,
            roleId: 1
        });

        if (file) {
            const newImageUtilisateur = await dbConnector.ImageUtilisateur.create({
                nom: file.originalname,
                uid: file.filename,
                UtilisateurId: newUtilisateur.id
            });

            await dbConnector.Utilisateur.update({ imageId: newImageUtilisateur.id }, { where: { id: newUtilisateur.id } });
        }

        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
    }
};
