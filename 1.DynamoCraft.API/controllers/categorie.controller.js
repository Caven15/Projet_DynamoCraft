const dbConnector = require("../tools/ConnexionDb.tools").get();
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

// Créer une nouvelle catégorie
exports.create = async (req, res, next) => {
    logMessage("Début de la création de la catégorie", COLOR_YELLOW);

    try {
        const { nom } = req.body;

        const newCategorie = await dbConnector.Categorie.create({
            nom,
        });

        logMessage("Catégorie créée avec succès", COLOR_GREEN);
        res.status(201).json(newCategorie);
    } catch (error) {
        logMessage("Erreur lors de la création de la catégorie", COLOR_RED);
        console.error("Erreur lors de la création de la catégorie :", error);
        res.status(500).json({
            message: "Erreur lors de la création de la catégorie",
        });
    }
};

// Mettre à jour une catégorie par ID
exports.update = async (req, res, next) => {
    logMessage("Début de la mise à jour de la catégorie", COLOR_YELLOW);

    try {
        const { nom } = req.body;
        console.log(nom);

        const categorie = await dbConnector.Categorie.findByPk(req.params.id);
        if (!categorie) {
            logMessage("Catégorie non trouvée", COLOR_RED);
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        await categorie.update({
            nom,
        });

        logMessage(
            `Catégorie ${req.params.id} mise à jour avec succès`,
            COLOR_GREEN
        );
        res.status(200).json({
            message: `Catégorie ${req.params.id} mise à jour avec succès !`,
        });
    } catch (error) {
        logMessage("Erreur lors de la mise à jour de la catégorie", COLOR_RED);
        console.error("Erreur lors de la mise à jour de la catégorie :", error);
        res.status(500).json({
            message: "Erreur lors de la mise à jour de la catégorie",
        });
    }
};

// Récupérer une catégorie par ID
exports.getById = async (req, res, next) => {
    logMessage("Début de la récupération de la catégorie", COLOR_YELLOW);

    try {
        const categorie = await dbConnector.Categorie.findByPk(req.params.id);
        if (!categorie) {
            logMessage("Catégorie non trouvée", COLOR_RED);
            return res.status(404).json({ message: "Catégorie non trouvée" });
        }

        logMessage("Catégorie récupérée avec succès", COLOR_GREEN);
        res.status(200).json(categorie);
    } catch (error) {
        logMessage("Erreur lors de la récupération de la catégorie", COLOR_RED);
        console.error(
            "Erreur lors de la récupération de la catégorie :",
            error
        );
        res.status(500).json({
            message: "Erreur lors de la récupération de la catégorie",
        });
    }
};

// Récupérer toutes les catégories
exports.getAll = async (req, res, next) => {
    logMessage(
        "Début de la récupération de toutes les catégories",
        COLOR_YELLOW
    );

    try {
        const allCategories = await dbConnector.Categorie.findAll();

        logMessage("Toutes les catégories récupérées avec succès", COLOR_GREEN);
        res.status(200).json(allCategories);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération de toutes les catégories",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la récupération de toutes les catégories :",
            error
        );
        res.status(500).json({
            message: "Erreur lors de la récupération de toutes les catégories",
        });
    }
};
