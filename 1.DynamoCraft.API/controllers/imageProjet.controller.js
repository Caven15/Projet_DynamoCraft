const dbConnector = require("../tools/ConnexionDb.tools").get();
const path = require('path');
const fs = require('fs');

exports.create = async (req, res, next) => {
    try {
        const { files } = req;
        const { id } = req.params;
        console.log(id);

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'Aucun fichier fourni' });
        }

        const projet = await dbConnector.Projet.findByPk(id);
        if (!projet) {
            // Supprimer les fichiers téléchargés en cas d'erreur
            files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.log(err);
                });
            });
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        const existingImages = await dbConnector.ImageProjet.findAll({ where: { projetId: id } });
        if (existingImages.length + files.length > 8) {
            // Limite de 8 images dépassée
            // Supprimer les fichiers téléchargés en cas d'erreur
            files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.log(err);
                });
            });
            return res.status(400).json({ message: 'Limite de 8 images par projet atteinte' });
        }

        const images = [];
        for (const file of files) {
            const newImageProjet = await dbConnector.ImageProjet.create({
                nom: file.filename,
                dateCreation: new Date(),
                dateModif: new Date(),
                projetId : id
            });
            images.push(newImageProjet);
        }

        res.status(201).json({ message: 'Images projet ajoutées avec succès', images });
    } catch (error) {
        console.error('Erreur lors de l\'ajout des images projet :', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout des images projet' });
    }
};

// Récupérer toutes les images par projet
exports.getAllByProjetId = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Vérifier si le projet existe
        const projet = await dbConnector.Projet.findByPk(id);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Récupérer toutes les images associées au projet
        const images = await dbConnector.ImageProjet.findAll({
            where: { id }
        });

        res.status(200).json({ images });
    } catch (error) {
        console.error('Erreur lors de la récupération des images par projet :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des images par projet' });
    }
};

exports.delete = async (req, res, next) => {
    try {
        const imageId = req.params.id;

        // Vérifier si l'image projet existe
        const imageProjet = await dbConnector.ImageProjet.findByPk(imageId);
        if (!imageProjet) {
            return res.status(404).json({ message: 'Image projet non trouvée' });
        }

        // Supprimer le fichier d'image
        const imagePath = path.join(__dirname, '../uploads/', imageProjet.nom);
        fs.unlink(imagePath, (err) => {
            if (err) console.log('Erreur lors de la suppression de l\'image projet:', err);
        });

        // Supprimer l'image projet de la base de données
        await imageProjet.destroy();

        res.status(200).json({ message: 'Image projet supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'image projet :', error);
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'image projet' });
    }
};