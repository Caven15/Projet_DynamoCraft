const { faker } = require('@faker-js/faker');
const { logMessage, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } = require("../tools/logs.tools");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logMessage("Étape 3/1 : Génération des statistiques", COLOR_YELLOW);

        const statistiques = [];

        const startDate = new Date(2022, 0, 1); // 1er janvier 2022
        const endDate = new Date(2023, 11, 31); // 31 décembre 2023

        try {
            // Sous-étape 1/2 : Génération des données aléatoires
            logMessage("Sous-étape 1/2 : Génération des données aléatoires pour les statistiques", COLOR_YELLOW);

            for (let i = 0; i < 300; i++) {
                const randomDate = new Date(
                    startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
                );

                statistiques.push({
                    nombreApreciation: faker.datatype.number({ min: 0, max: 500 }),
                    nombreTelechargement: faker.datatype.number({ min: 0, max: 1000 }),
                    datePublication: randomDate,
                    dateModification: randomDate,
                });
            }

            // Sous-étape 2/2 : Insertion des données dans la base de données
            logMessage("Sous-étape 2/2 : Insertion des statistiques dans la table 'statistique'", COLOR_YELLOW);
            await queryInterface.bulkInsert('statistique', statistiques, {});

            logMessage("Insertion des statistiques réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de l'insertion des statistiques : ${error.message}`, COLOR_RED);
        }
    },

    down: async (queryInterface, Sequelize) => {
        logMessage("Étape 3/2 : Suppression des statistiques de la base de données", COLOR_YELLOW);

        try {
            await queryInterface.bulkDelete('statistique', null, {});
            logMessage("Suppression des statistiques réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de la suppression des statistiques : ${error.message}`, COLOR_RED);
        }
    },
};
