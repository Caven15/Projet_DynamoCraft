const { faker } = require("@faker-js/faker");
const { logMessage, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } = require("../tools/logs.tools");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logMessage("Étape 11/1 : Génération et insertion des téléchargements de projets par les utilisateurs", COLOR_YELLOW);

        const telechargements = [];
        const utilisateurs = Array.from({ length: 300 }, (_, i) => i + 1);
        const projets = Array.from({ length: 300 }, (_, i) => i + 1);

        logMessage("Sous-étape 1/2 : Génération des enregistrements de téléchargements", COLOR_YELLOW);

        // Pour chaque utilisateur
        utilisateurs.forEach((utilisateurId) => {
            // Nombre aléatoire de téléchargements pour chaque utilisateur (entre 1 et 50)
            const nombreTelechargements = faker.number.int({ min: 1, max: 50 });

            // Sélectionner des projets aléatoires pour cet utilisateur
            const projetsTelecharges = faker.helpers.arrayElements(projets, nombreTelechargements);

            // Créer les enregistrements pour chaque téléchargement
            projetsTelecharges.forEach((projetId) => {
                const dateTelechargement = faker.date.between({
                    from: "2022-01-01",
                    to: "2023-12-31",
                });
                telechargements.push({
                    utilisateurId: utilisateurId,
                    projetId: projetId,
                    dateTelechargement: dateTelechargement,
                });
            });
        });

        logMessage(`Sous-étape 1/2 : Génération des téléchargements terminée avec ${telechargements.length} enregistrements`, COLOR_GREEN);

        logMessage("Sous-étape 2/2 : Insertion des enregistrements de téléchargements dans la base de données", COLOR_YELLOW);

        try {
            await queryInterface.bulkInsert("utilisateurProjet", telechargements, {});
            logMessage("Insertion des téléchargements réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de l'insertion des téléchargements : ${error.message}`, COLOR_RED);
        }
    },

    down: async (queryInterface, Sequelize) => {
        logMessage("Étape 11/2 : Suppression des téléchargements de la base de données", COLOR_YELLOW);

        try {
            await queryInterface.bulkDelete("utilisateurProjet", null, {});
            logMessage("Suppression des téléchargements réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de la suppression des téléchargements : ${error.message}`, COLOR_RED);
        }
    },
};
