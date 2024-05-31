const dbConnector = require('../tools/ConnexionDb.tools').get();
const fs = require('fs');
const path = require('path');
const multerConfig3D = require('../tools/multerConfig3D.tools')

exports.create = async (req, res, next) => {
    try {
        const { files } = req;
        const { projetId } = req.body;

        if (!files || files.length === 0) {
            return res.status(400).json({ message: 'Aucun fichier fourni' });
        }

        if (files.length > 25) {
            files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.log(err);
                });
            });
            return res.status(400).json({ message: 'Limite de 25 fichiers par envoi dépassée' });
        }

        const projet = await dbConnector.Projet.findByPk(projetId);
        if (!projet) {
            files.forEach(file => {
                fs.unlink(file.path, (err) => {
                    if (err) console.log(err);
                });
            });
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        const existingModeles = await dbConnector.Modele3D.findAll({ where: { projetId } });
        const existingNoms = existingModeles.map(modele => modele.nom.split('-')[1]);

        const modeles3D = [];
        for (const file of files) {
            const nomPartie = file.filename.split('-')[1];

            if (existingNoms.includes(nomPartie)) {
                files.forEach(file => {
                    fs.unlink(file.path, (err) => {
                        if (err) console.log(err);
                    });
                });
                return res.status(400).json({ message: `Le nom de fichier "${file.filename}" est déjà présent dans le projet` });
            }

            const newModele3D = await dbConnector.Modele3D.create({
                nom: file.filename,
                dateCreation: new Date(),
                dateModif: new Date(),
                projetId
            });
            modeles3D.push(newModele3D);
        }

        res.status(201).json({ message: 'Modèles 3D ajoutés avec succès', modeles3D });
    } catch (error) {
        console.error('Erreur lors de l\'ajout des modèles 3D :', error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout des modèles 3D' });
    }
};

// Méthode pour récupérer tous les modèles d'un projet 3D
exports.getByProjetId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const modeles3D = await dbConnector.Modele3D.findAll({ where: { projetId: id } });

        res.status(200).json({ modeles3D });

    } catch (error) {
        console.error('Erreur lors de la récupération des modèles 3D :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des modèles 3D' });
    }
};

// Méthode pour supprimer un modèle 3D par ID
exports.delete = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Vérifier si le modèle 3D existe
        const modele3D = await dbConnector.Modele3D.findByPk(id);
        if (!modele3D) {
            return res.status(404).json({ message: 'Modèle 3D non trouvé' });
        }

        await modele3D.destroy();

        res.status(200).json({ message: 'Modèle 3D supprimé avec succès' });

    } catch (error) {
        console.error('Erreur lors de la suppression du modèle 3D :', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du modèle 3D' });
    }
};
