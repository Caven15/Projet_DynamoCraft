const { logMessage, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } = require("../tools/logs.tools");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logMessage("Étape 4/1 : Insertion des catégories dans la base de données", COLOR_YELLOW);

        try {
            // Sous-étape 1/2 : Préparation des données
            logMessage("Sous-étape 1/2 : Préparation des données pour insertion", COLOR_YELLOW);
            const data = [
                { nom: "Objets décoratifs" },
                { nom: "Pièces de rechange" },
                { nom: "Jouets" },
                { nom: "Bijoux" },
                { nom: "Accessoires" },
                { nom: "Prototypes" },
                { nom: "Éducation" },
                { nom: "Arts" },
                { nom: "Gadgets" },
                { nom: "Outils" },
            ];

            // Sous-étape 2/2 : Insertion des données dans la base de données
            logMessage("Sous-étape 2/2 : Insertion des catégories dans la table 'Categorie'", COLOR_YELLOW);
            await queryInterface.bulkInsert("Categorie", data, {});

            logMessage("Insertion des catégories réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de l'insertion des catégories : ${error.message}`, COLOR_RED);
        }
    },

    down: async (queryInterface, Sequelize) => {
        logMessage("Étape 4/2 : Suppression des catégories de la base de données", COLOR_YELLOW);

        try {
            await queryInterface.bulkDelete("Categorie", null, {});
            logMessage("Suppression des catégories réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de la suppression des catégories : ${error.message}`, COLOR_RED);
        }
    },
};
