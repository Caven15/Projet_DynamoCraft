const { logMessage, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } = require("../../tools/logs.tools");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logMessage("Étape 2/1 : Insertion des rôles dans la base de données", COLOR_YELLOW);

        try {
            // Sous-étape 1/2 : Préparation des données
            logMessage("Sous-étape 1/2 : Préparation des données pour insertion", COLOR_YELLOW);
            const data = [
                { nom: "Utilisateur" },
                { nom: "Modérateur" },
                { nom: "Administrateur" },
            ];

            // Sous-étape 2/2 : Insertion des données
            logMessage("Sous-étape 2/2 : Insertion des données dans la table 'role'", COLOR_YELLOW);
            await queryInterface.bulkInsert("role", data, {});

            logMessage("Insertion des rôles réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de l'insertion des rôles : ${error.message}`, COLOR_RED);
        }
    },

    down: async (queryInterface, Sequelize) => {
        logMessage("Étape 2/2 : Suppression des rôles de la base de données", COLOR_YELLOW);

        try {
            await queryInterface.bulkDelete("role", null, {});
            logMessage("Suppression des rôles réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de la suppression des rôles : ${error.message}`, COLOR_RED);
        }
    },
};
