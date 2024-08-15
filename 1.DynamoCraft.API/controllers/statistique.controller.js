const dbConnector = require("../tools/ConnexionDb.tools").get();
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

// Créer une nouvelle statistique
exports.create = async (req, res, next) => {
    logMessage("Début de la création de la statistique", COLOR_YELLOW);

    try {
        const newStat = await dbConnector.Statistique.create({
            nombreApreciation: 0,
            nombreTelechargement: 0,
            datePublication: new Date(),
            dateModification: new Date(),
        });

        logMessage("Statistique créée avec succès", COLOR_GREEN);
        res.status(201).json(newStat);
    } catch (error) {
        logMessage("Erreur lors de la création de la statistique", COLOR_RED);
        console.error("Erreur lors de la création de la statistique :", error);
        res.status(500).json({
            message: "Erreur lors de la création de la statistique",
        });
    }
};

// Mettre à jour une statistique par ID
exports.update = async (req, res, next) => {
    logMessage("Début de la mise à jour de la statistique", COLOR_YELLOW);

    try {
        const { nombreApreciation, nombreTelechargement } = req.body;
        const stat = await dbConnector.Statistique.findByPk(req.params.id);

        if (!stat) {
            logMessage("Statistique non trouvée", COLOR_RED);
            return res.status(404).json({ message: "Statistique non trouvée" });
        }

        logMessage(
            `Mise à jour de la statistique avec ID : ${req.params.id}`,
            COLOR_YELLOW
        );
        await stat.update({
            nombreApreciation,
            nombreTelechargement,
            dateModification: new Date(),
        });

        logMessage("Statistique mise à jour avec succès", COLOR_GREEN);
        res.status(200).json({
            message: `Statistique ${req.params.id} mise à jour avec succès !`,
        });
    } catch (error) {
        logMessage(
            "Erreur lors de la mise à jour de la statistique",
            COLOR_RED
        );
        console.error(
            "Erreur lors de la mise à jour de la statistique :",
            error
        );
        res.status(500).json({
            message: "Erreur lors de la mise à jour de la statistique",
        });
    }
};

// Récupérer le nombre total d'appréciations et de téléchargements
exports.getTotals = async (req, res, next) => {
    logMessage(
        "Début de la récupération des totaux des statistiques",
        COLOR_YELLOW
    );

    try {
        const totals = await dbConnector.Statistique.findAll({
            attributes: [
                [
                    dbConnector.Sequelize.fn(
                        "SUM",
                        dbConnector.Sequelize.col("nombreApreciation")
                    ),
                    "totalAppreciations",
                ],
                [
                    dbConnector.Sequelize.fn(
                        "SUM",
                        dbConnector.Sequelize.col("nombreTelechargement")
                    ),
                    "totalTelechargements",
                ],
            ],
        });

        logMessage(
            "Totaux des statistiques récupérés avec succès",
            COLOR_GREEN
        );
        res.status(200).json(totals);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des totaux des statistiques",
            COLOR_RED
        );
        console.error("Erreur lors de la récupération des totaux :", error);
        res.status(500).json({
            message: "Erreur lors de la récupération des totaux",
        });
    }
};
