const { logMessage, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } = require("../tools/logs.tools");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logMessage("Étape 1/1 : Insertion des statuts dans la base de données", COLOR_YELLOW);

        try {
            // Sous-étape 1/2 : Préparation des données
            logMessage("Sous-étape 1/2 : Préparation des données pour insertion", COLOR_YELLOW);
            const data = [
                { nom: "Valide" },
                { nom: "Invalide" },
                { nom: "En attente" },
            ];

            // Sous-étape 2/2 : Insertion des données
            logMessage("Sous-étape 2/2 : Insertion des données dans la table 'statut'", COLOR_YELLOW);
            await queryInterface.bulkInsert("statut", data, {});

            logMessage("Insertion des statuts réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de l'insertion des statuts : ${error.message}`, COLOR_RED);
        }
    },

    down: async (queryInterface, Sequelize) => {
        logMessage("Étape 1/1 : Suppression des statuts de la base de données", COLOR_YELLOW);

        try {
            await queryInterface.bulkDelete("statut", null, {});
            logMessage("Suppression des statuts réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de la suppression des statuts : ${error.message}`, COLOR_RED);
        }
    },
};
