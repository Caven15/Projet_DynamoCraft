// controllers/authController.js
const dbConnector = require("../tools/ConnexionDb.tools").get();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const fs = require('fs');

exports.register = async (req, res, next) => {
    try {
        const { pseudo, email, dateNaissance, biographie, password, centreInterets } = req.body;
        const { file } = req;

        if (!pseudo || !email || !dateNaissance || !biographie || !password || !centreInterets) {
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

        // Vérifier le nombre d'utilisateurs existants
        const userCount = await dbConnector.Utilisateur.count();
        const roleId = userCount === 0 ? 3 : 1; // 3 pour le premier utilisateur, 1 pour les suivants

        const newUtilisateur = await dbConnector.Utilisateur.create({
            pseudo,
            email,
            dateNaissance,
            biographie,
            password: hashedPassword,
            centreInterets,
            roleId: roleId, // Utiliser roleId calculé
            statutCompte: true
        });

        if (file) {
            const newImageUtilisateur = await dbConnector.ImageUtilisateur.create({
                nom: file.filename,
                UtilisateurId: newUtilisateur.id
            });

            await dbConnector.Utilisateur.update({ imageId: newImageUtilisateur.id }, { where: { id: newUtilisateur.id } });
        }

        res.status(201).json({ message: 'Utilisateur enregistré avec succès', utilisateurId: newUtilisateur.id });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
    }
};


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe sont obligatoires' });
        }

        const utilisateur = await dbConnector.Utilisateur.findOne({ where: { email } });

        if (!utilisateur) {
            return res.status(403).json({ message: "Cette adresse email n'existe pas" });
        }

        const passwordMatch = bcrypt.compareSync(password.trim(), utilisateur.password);

        if (!passwordMatch) {
            return res.status(403).json({ message: "Mot de passe incorrect" });
        }

        const dataToken = {
            id: utilisateur.id,
            roleId: utilisateur.roleId
        };

        const token = jwt.sign(dataToken, process.env.TOKEN_SECRET, { expiresIn: parseInt(process.env.TOKEN_LIFE) });

        res.status(202).json({
            accessToken: token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de la connexion de l\'utilisateur' });
    }
};