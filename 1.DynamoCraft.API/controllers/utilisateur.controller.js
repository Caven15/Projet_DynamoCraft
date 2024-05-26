const dbConnector = require("../tools/ConnexionDb.tools").get();
const fs = require('fs');

// Récupérer tous les utilisateurs
exports.getAll = async (req, res, next) => {
    try {
        const allUsers = await dbConnector.Utilisateur.findAll({
            attributes: {
                exclude: ['password', 'imageId','roleId']
            },
            include: [
                {
                    model: dbConnector.ImageUtilisateur,
                    attributes: ['nom', 'id']
                },
                {
                    model: dbConnector.Role,
                    attributes: ['nom']
                }
            ]
        });
        res.status(200).json(allUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
};

// Récupérer un utilisateur par ID
exports.getById = async (req, res, next) => {
    try {
        const user = await dbConnector.Utilisateur.findOne({
            where: {
                id: req.params.id
            },
            attributes: {
                exclude: ['password', 'imageId','roleId']
            },
            include: [
                {
                    model: dbConnector.ImageUtilisateur,
                    attributes: ['nom', 'id']
                },
                {
                    model: dbConnector.Role,
                    attributes: ['nom']
                }
            ]
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur par ID' });
    }
};

// Mettre à jour un utilisateur par ID
exports.update = async (req, res, next) => {

    try {
        const { pseudo, email, dateNaissance, biographie, centreInterets, statutCompte } = req.body;
        const { file } = req;

        const user = await dbConnector.Utilisateur.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier s'il existe déjà un utilisateur avec l'e-mail fourni (à l'exception de l'utilisateur en cours de mise à jour)
        if (email) {
            const existingUser = await dbConnector.Utilisateur.findOne({ where: { email, id: { [dbConnector.Sequelize.Op.ne]: req.params.id } } });
            if (existingUser) {
                return res.status(403).json({ message: "L'adresse e-mail existe déjà dans le système" });
            }
        }

        // Si un fichier est fourni, gérer la mise à jour de l'image
        if (file) {
            console.log("fichier trouvé");
            const imageUtilisateur = await dbConnector.ImageUtilisateur.findOne({ where: { utilisateurId: user.id } });
            const newImage = {
                nom: file.filename,
                utilisateurId: user.id
            };

            if (imageUtilisateur) {
                // Supprimer l'ancienne image
                const oldImagePath = `./uploads/${imageUtilisateur.nom}`;
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.log('Erreur lors de la suppression de l\'ancienne image:', err);
                });

                // Mettre à jour l'image
                await imageUtilisateur.update(newImage);
            } else {
                // Créer une nouvelle image
                await dbConnector.ImageUtilisateur.create(newImage);
            }

            // Mettre à jour la référence de l'image dans l'utilisateur
            await user.update({ imageId: newImage.id });
        }

        // Mettre à jour les autres informations de l'utilisateur
        await user.update({
            pseudo,
            email,
            dateNaissance,
            biographie,
            centreInterets,
            statutCompte,
            dateModif: new Date()
        });

        res.status(200).json({ message: `Utilisateur ${req.params.id} mis à jour avec succès !` });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
};

// Supprimer un utilisateur par ID
exports.delete = async (req, res, next) => {
    try {
        const user = await dbConnector.Utilisateur.findByPk(req.params.id);
        if (user) {
            // Trouver et supprimer l'image de profil associée dans la base de données
            const imageUtilisateur = await dbConnector.ImageUtilisateur.findOne({ where: { utilisateurId: user.id } });
            if (imageUtilisateur) {
                await imageUtilisateur.destroy();
                // Supprimer le fichier image du dossier uploads
                const imagePath = `./uploads/${imageUtilisateur.nom}`;
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Erreur lors de la suppression de l\'image:', err);
                    } else {
                        console.log('Image supprimée avec succès:', imagePath);
                    }
                });
            }
            // Supprimer l'utilisateur de la base de données
            await user.destroy();
            res.status(200).json({ message: `Utilisateur ${req.params.id} supprimé avec succès !` });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
    }
};