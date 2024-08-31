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

// Récupérer les projets par statut
exports.getProjetsByStatut = async (req, res, next) => {
    logMessage("Récupération des projets par statut", COLOR_YELLOW);
    try {
        const projets = await dbConnector.Projet.findAll({
            attributes: [
                "statutId",
                [
                    dbConnector.Sequelize.fn(
                        "COUNT",
                        dbConnector.Sequelize.col("Projet.id")
                    ),
                    "count",
                ],
            ],
            group: ["statutId", "statut.id"],
            include: {
                model: dbConnector.Statut,
                as: "statut",
                attributes: ["nom"],
            },
        });
        res.status(200).json(projets);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des projets par statut",
            COLOR_RED
        );
        res.status(500).json({
            message: "Erreur lors de la récupération des projets par statut",
            error: error.message,
        });
    }
};

// Récupérer les projets par catégorie
exports.getProjetsByCategorie = async (req, res, next) => {
    logMessage("Récupération des projets par catégorie", COLOR_YELLOW);
    try {
        const projets = await dbConnector.Projet.findAll({
            attributes: [
                "categorieId",
                [
                    dbConnector.Sequelize.fn(
                        "COUNT",
                        dbConnector.Sequelize.col("Projet.id")
                    ),
                    "count",
                ],
            ],
            group: ["categorieId", "Categorie.id"],
            include: {
                model: dbConnector.Categorie,
                attributes: ["nom"],
            },
        });
        res.status(200).json(projets);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des projets par catégorie",
            COLOR_RED
        );
        res.status(500).json({
            message: "Erreur lors de la récupération des projets par catégorie",
            error: error.message,
        });
    }
};

// Récupérer le nombre moyen de téléchargements par projet
exports.getAverageDownloads = async (req, res, next) => {
    logMessage(
        "Récupération du nombre moyen de téléchargements par projet",
        COLOR_YELLOW
    );
    try {
        const averageDownloads = await dbConnector.Statistique.findOne({
            attributes: [
                [
                    dbConnector.Sequelize.fn(
                        "AVG",
                        dbConnector.Sequelize.col("nombreTelechargement")
                    ),
                    "averageDownloads",
                ],
            ],
        });
        res.status(200).json(averageDownloads);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération du nombre moyen de téléchargements",
            COLOR_RED
        );
        res.status(500).json({
            message:
                "Erreur lors de la récupération du nombre moyen de téléchargements",
        });
    }
};

// Récupérer le nombre moyen de likes par projet
exports.getAverageLikes = async (req, res, next) => {
    logMessage(
        "Récupération du nombre moyen de likes par projet",
        COLOR_YELLOW
    );
    try {
        const averageLikes = await dbConnector.Statistique.findOne({
            attributes: [
                [
                    dbConnector.Sequelize.fn(
                        "AVG",
                        dbConnector.Sequelize.col("nombreApreciation")
                    ),
                    "averageLikes",
                ],
            ],
        });
        res.status(200).json(averageLikes);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération du nombre moyen de likes",
            COLOR_RED
        );
        res.status(500).json({
            message: "Erreur lors de la récupération du nombre moyen de likes",
        });
    }
};

// Récupérer le top 5 des projets les plus téléchargés
exports.getTop5DownloadedProjets = async (req, res, next) => {
    logMessage(
        "Récupération du top 5 des projets les plus téléchargés",
        COLOR_YELLOW
    );
    try {
        const top5 = await dbConnector.Projet.findAll({
            include: {
                model: dbConnector.Statistique,
                attributes: ["nombreTelechargement"],
            },
            order: [
                [
                    dbConnector.Sequelize.col(
                        "Statistique.nombreTelechargement"
                    ),
                    "DESC",
                ],
            ],
            limit: 5,
        });
        res.status(200).json(top5);
    } catch (error) {
        logMessage("Erreur lors de la récupération du top 5", COLOR_RED);
        res.status(500).json({
            message: "Erreur lors de la récupération du top 5",
        });
    }
};

// Récupérer l'évolution des téléchargements par mois
exports.getDownloadsEvolutionByMonth = async (req, res, next) => {
    logMessage(
        "Récupération de l'évolution des téléchargements par mois",
        COLOR_YELLOW
    );
    try {
        const evolution = await dbConnector.Statistique.findAll({
            attributes: [
                [
                    dbConnector.Sequelize.fn(
                        "MONTH",
                        dbConnector.Sequelize.col("datePublication")
                    ),
                    "month",
                ],
                [
                    dbConnector.Sequelize.fn(
                        "SUM",
                        dbConnector.Sequelize.col("nombreTelechargement")
                    ),
                    "totalDownloads",
                ],
            ],
            group: ["month"],
        });
        res.status(200).json(evolution);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération de l'évolution des téléchargements",
            COLOR_RED
        );
        res.status(500).json({
            message:
                "Erreur lors de la récupération de l'évolution des téléchargements",
        });
    }
};

// Récupérer l'évolution des téléchargements par semaine
exports.getDownloadsEvolutionByWeek = async (req, res, next) => {
    logMessage("Récupération de l'évolution des téléchargements par semaine", COLOR_YELLOW);
    try {
        const evolution = await dbConnector.Statistique.findAll({
            attributes: [
                [dbConnector.Sequelize.fn("WEEKDAY", dbConnector.Sequelize.col("datePublication")), "weekday"],
                [dbConnector.Sequelize.fn("SUM", dbConnector.Sequelize.col("nombreTelechargement")), "totalDownloads"],
            ],
            group: ["weekday"],
        });
        res.status(200).json(evolution);
    } catch (error) {
        logMessage("Erreur lors de la récupération des téléchargements par semaine", COLOR_RED);
        res.status(500).json({
            message: "Erreur lors de la récupération des téléchargements par semaine",
        });
    }
};

// Récupérer l'évolution des téléchargements par semaine
exports.getDownloadsEvolutionByDay = async (req, res, next) => {
    logMessage("Récupération de l'évolution des téléchargements par jour", COLOR_YELLOW);
    try {
        const evolution = await dbConnector.Statistique.findAll({
            attributes: [
                [dbConnector.Sequelize.fn("HOUR", dbConnector.Sequelize.col("datePublication")), "hour"],
                [dbConnector.Sequelize.fn("SUM", dbConnector.Sequelize.col("nombreTelechargement")), "totalDownloads"],
            ],
            group: ["hour"],
        });
        res.status(200).json(evolution);
    } catch (error) {
        logMessage("Erreur lors de la récupération des téléchargements par jour", COLOR_RED);
        res.status(500).json({
            message: "Erreur lors de la récupération des téléchargements par jour",
        });
    }
};

// Récupérer les projets les plus commentés
exports.getMostCommentedProjets = async (req, res, next) => {
    logMessage("Récupération des projets les plus commentés", COLOR_YELLOW);
    try {
        const mostCommented = await dbConnector.Projet.findAll({
            include: {
                model: dbConnector.Commentaire,
                attributes: [
                    [
                        dbConnector.Sequelize.fn(
                            "COUNT",
                            dbConnector.Sequelize.col("Commentaire.id")
                        ),
                        "commentCount",
                    ],
                ],
            },
            group: ["Projet.id"],
            order: [[dbConnector.Sequelize.literal("commentCount"), "DESC"]],
            limit: 5,
        });
        res.status(200).json(mostCommented);
    } catch (error) {
        logMessage(
            "Erreur lors de la récupération des projets les plus commentés",
            COLOR_RED
        );
        res.status(500).json({
            message:
                "Erreur lors de la récupération des projets les plus commentés",
        });
    }
};
