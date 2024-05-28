const dbConnector = require("../tools/ConnexionDb.tools").get();
const path = require('path');
const fs = require('fs');

// Ajouter une image utilisateur
exports.addImage = async (req, res, next) => {
    try {
        const { file } = req;
        const { utilisateurId } = req.params; // UtilisateurId from URL params

        if (!file) {
            return res.status(400).json({ message: 'Aucun fichier fourni' });
        }

        const utilisateur = await dbConnector.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            fs.unlink(`./uploads/${file.filename}`, (err) => {
                if (err) console.log(err);
            });
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const newImageUtilisateur = await dbConnector.ImageUtilisateur.create({
            nom: file.filename,
            dateAjout: new Date(),
            dateModif: new Date(),
            utilisateurId: utilisateurId
        });

        await utilisateur.update({ imageId: newImageUtilisateur.id });

        res.status(201).json({ message: 'Image utilisateur ajoutée avec succès', image: newImageUtilisateur });

    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'image utilisateur :', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'image utilisateur' });
    }
};

// Mettre à jour une image utilisateur par ID
exports.updateImage = async (req, res, next) => {
    try {
        const { file } = req;
        const { utilisateurId } = req.params;

        if (!file) {
            return res.status(400).json({ message: 'Aucun fichier fourni' });
        }

        const utilisateur = await dbConnector.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            fs.unlink(`./uploads/${file.filename}`, (err) => {
                if (err) console.log(err);
            });
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const imageUtilisateur = await dbConnector.ImageUtilisateur.findOne({ where: { utilisateurId } });
        if (!imageUtilisateur) {
            fs.unlink(`./uploads/${file.filename}`, (err) => {
                if (err) console.log(err);
            });
            return res.status(404).json({ message: 'Image utilisateur non trouvée' });
        }

        const oldImagePath = path.join(__dirname, '../uploads/', imageUtilisateur.nom);
        fs.unlink(oldImagePath, (err) => {
            if (err) console.log('Erreur lors de la suppression de l\'ancienne image:', err);
        });

        await imageUtilisateur.update({
            nom: file.filename,
            dateModif: new Date()
        });

        res.status(200).json({ message: 'Image utilisateur mise à jour avec succès', image: imageUtilisateur });

    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'image utilisateur :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'image utilisateur' });
    }
};

// Supprimer une image utilisateur par ID
exports.deleteImage = async (req, res, next) => {
    try {
        const { utilisateurId } = req.params;

        const utilisateur = await dbConnector.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        const imageUtilisateur = await dbConnector.ImageUtilisateur.findOne({ where: { utilisateurId } });
        if (!imageUtilisateur) {
            return res.status(404).json({ message: 'Image utilisateur non trouvée' });
        }

        const imagePath = path.join(__dirname, '../uploads/', imageUtilisateur.nom);
        fs.unlink(imagePath, (err) => {
            if (err) console.log('Erreur lors de la suppression de l\'image :', err);
        });

        await imageUtilisateur.destroy();

        res.status(200).json({ message: 'Image utilisateur supprimée avec succès' });

    } catch (error) {
        console.error('Erreur lors de la suppression de l\'image utilisateur :', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'image utilisateur' });
    }
};
