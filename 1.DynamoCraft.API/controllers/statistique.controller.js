const dbConnector = require("../tools/ConnexionDb.tools").get();

// Créer une nouvelle statistique
exports.create = async (req, res, next) => {
    try {
        const newStat = await dbConnector.Statistique.create({
            nombreApreciation: 0,
            nombreTelechargement: 0,
            datePublication: new Date(),
            dateModification: new Date()
        });
        res.status(201).json(newStat);
    } catch (error) {
        console.error('Erreur lors de la création de la statistique:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la statistique' });
    }
};

// Mettre à jour une statistique par ID
exports.update = async (req, res, next) => {
    try {
        const { nombreApreciation, nombreTelechargement } = req.body;
        const stat = await dbConnector.Statistique.findByPk(req.params.id);
        if (!stat) {
            return res.status(404).json({ message: 'Statistique non trouvée' });
        }

        await stat.update({
            nombreApreciation,
            nombreTelechargement,
            dateModification: new Date()
        });
        res.status(200).json({ message: `Statistique ${req.params.id} mise à jour avec succès !` });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la statistique:', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la statistique' });
    }
};

// Récupérer le nombre total d'appréciations et de téléchargements
exports.getTotals = async (req, res, next) => {
    try {
        const totals = await dbConnector.Statistique.findAll({
            attributes: [
                [dbConnector.Sequelize.fn('SUM', dbConnector.Sequelize.col('nombreApreciation')), 'totalAppreciations'],
                [dbConnector.Sequelize.fn('SUM', dbConnector.Sequelize.col('nombreTelechargement')), 'totalTelechargements']
            ]
        });

        res.status(200).json(totals);
    } catch (error) {
        console.error('Erreur lors de la récupération des totaux:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des totaux' });
    }
};

// Incrémenter le nombre de téléchargements
exports.incrementDownloads = async (req, res, next) => {
    try {
        const stat = await dbConnector.Statistique.findByPk(req.params.id);
        if (!stat) {
            return res.status(404).json({ message: 'Statistique non trouvée' });
        }

        await stat.update({
            nombreTelechargement: stat.nombreTelechargement + 1,
            dateModification: new Date()
        });
        res.status(200).json({ message: `Nombre de téléchargements pour la statistique ${req.params.id} incrémenté avec succès !` });
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation des téléchargements :', error);
        res.status(500).json({ message: 'Erreur lors de l\'incrémentation des téléchargements' });
    }
};

// Incrémenter le nombre d'appréciations
exports.incrementLikes = async (req, res, next) => {
    try {
        const stat = await dbConnector.Statistique.findByPk(req.params.id);
        if (!stat) {
            return res.status(404).json({ message: 'Statistique non trouvée' });
        }

        await stat.update({
            nombreApreciation: stat.nombreApreciation + 1,
            dateModification: new Date()
        });
        res.status(200).json({ message: `Nombre d'appréciations pour la statistique ${req.params.id} incrémenté avec succès !` });
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation des appréciations :', error);
        res.status(500).json({ message: 'Erreur lors de l\'incrémentation des appréciations' });
    }
};