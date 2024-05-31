const dbConnector = require("../tools/ConnexionDb.tools").get();
const { createZip } = require('../tools/zipConfig.tools');
const path = require('path');
const fs = require('fs');

exports.downloadProjet = async (req, res, next) => {
    try {
        const { projetId } = req.params;

        // Récupérer le projet depuis la base de données
        const projet = await dbConnector.Projet.findByPk(projetId);

        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Récupérer l'ID de la statistique associée au projet
        const statistiqueId = projet.StatistiqueId;

        // Récupérer les noms des fichiers associés au projet depuis la base de données
        const files = await dbConnector.ImageProjet.findAll({
            attributes: ['nom'],
            where: { ProjetId: projetId }
        });

        // Chemin du dossier temporaire pour stocker le fichier ZIP
        const tempDir = path.join(__dirname, '..', 'temp');

        // Créer le répertoire temporaire s'il n'existe pas
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // Récupérer les chemins complets des fichiers dans le dossier d'upload
        const filePaths = files.map(file => path.join(__dirname, '..', 'uploads', file.nom));

        // Vérifier s'il y a des fichiers à compresser
        if (filePaths.length === 0) {
            return res.status(404).json({ message: 'Aucun fichier à compresser' });
        }

        // Créer le fichier ZIP avec le nom du projet
        const zipFilePath = await createZip(tempDir, projet.nom, filePaths);

        // Incrémenter le nombre de téléchargements dans la table des statistiques
        await dbConnector.Statistique.increment('nombreTelechargement', { where: { id: statistiqueId } });

        // Envoyer le fichier ZIP en réponse
        res.status(200).download(zipFilePath);

    } catch (error) {
        console.error('Erreur lors de la création du fichier ZIP :', error);
        res.status(500).json({ message: 'Erreur lors de la création du fichier ZIP' });
    }
};