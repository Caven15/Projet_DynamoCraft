const dbConnector = require("../tools/ConnexionDb.tools").get();

// Créer une nouvelle catégorie
exports.create = async (req, res, next) => {
    try {
        const { nom } = req.body;
        
        const newCategorie = await dbConnector.Categorie.create({
            nom
        });
        res.status(201).json(newCategorie);
    } catch (error) {
        console.error('Erreur lors de la création de la catégorie :', error);
        res.status(500).json({ message: 'Erreur lors de la création de la catégorie' });
    }
};

// Mettre à jour une catégorie par ID
exports.update = async (req, res, next) => {
    try {
        const { nom } = req.body;
        console.log(nom);
        const categorie = await dbConnector.Categorie.findByPk(req.params.id);
        if (!categorie) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        await categorie.update({
            nom
        });
        res.status(200).json({ message: `Catégorie ${req.params.id} mise à jour avec succès !` });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la catégorie' });
    }
};

// Récupérer une catégorie par ID
exports.getById = async (req, res, next) => {
    try {
        const categorie = await dbConnector.Categorie.findByPk(req.params.id);
        if (!categorie) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        res.status(200).json(categorie);
    } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de la catégorie' });
    }
};

// Récupérer toutes les catégories
exports.getAll = async (req, res, next) => {
    try {
        const allCategories = await dbConnector.Categorie.findAll();
        res.status(200).json(allCategories);
    } catch (error) {
        console.error('Erreur lors de la récupération de toutes les catégories :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de toutes les catégories' });
    }
};
