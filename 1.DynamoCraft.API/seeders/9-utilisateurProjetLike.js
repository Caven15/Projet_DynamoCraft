const { faker } = require("@faker-js/faker");
const { logMessage, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } = require("../tools/logs.tools");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logMessage("Étape 12/1 : Génération et insertion des likes des projets par les utilisateurs", COLOR_YELLOW);

        const likes = [];

        logMessage("Sous-étape 1/2 : Génération des enregistrements de likes", COLOR_YELLOW);

        for (let i = 1; i <= 300; i++) {
            // Chaque utilisateur peut aimer un nombre aléatoire de projets
            const numberOfLikes = faker.number.int({ min: 1, max: 20 });

            for (let j = 0; j < numberOfLikes; j++) {
                likes.push({
                    utilisateurId: i,
                    projetId: faker.number.int({ min: 1, max: 300 }), // Projets entre 1 et 300
                    dateLike: faker.date.past({ years: 2 }), // Date dans les 2 dernières années
                });
            }

            if (i % 50 === 0) {
                logMessage(`Sous-étape 1/2 - Génération des likes pour l'utilisateur ${i}/300 terminée`, COLOR_GREEN);
            }
        }

        logMessage(`Sous-étape 1/2 : Génération des likes terminée avec ${likes.length} enregistrements`, COLOR_GREEN);

        logMessage("Sous-étape 2/2 : Insertion des enregistrements de likes dans la base de données", COLOR_YELLOW);

        try {
            await queryInterface.bulkInsert("utilisateurProjetLike", likes, {});
            logMessage("Insertion des likes réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de l'insertion des likes : ${error.message}`, COLOR_RED);
        }
    },

    down: async (queryInterface, Sequelize) => {
        logMessage("Étape 12/2 : Suppression des likes de la base de données", COLOR_YELLOW);

        try {
            await queryInterface.bulkDelete("utilisateurProjetLike", null, {});
            logMessage("Suppression des likes réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de la suppression des likes : ${error.message}`, COLOR_RED);
        }
    },
};
