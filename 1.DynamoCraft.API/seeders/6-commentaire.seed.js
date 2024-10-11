const { faker } = require("@faker-js/faker");
const { logMessage, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } = require("../tools/logs.tools");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logMessage("Étape 9/1 : Génération et insertion des commentaires", COLOR_YELLOW);

        const commentaires = [];

        logMessage("Sous-étape 1/2 : Génération des commentaires pour chaque projet valide", COLOR_YELLOW);

        try {
            // Fetch valid projects
            const projetsValides = await queryInterface.sequelize.query(
                `SELECT id FROM projet WHERE estvalide = true`,
                { type: Sequelize.QueryTypes.SELECT }
            );

            for (let projet of projetsValides) {
                const nombreCommentaires = faker.number.int({ min: 1, max: 20 });

                for (let i = 0; i < nombreCommentaires; i++) {
                    const dateCreation = faker.date.past({ years: 2 });
                    const dateModif = faker.datatype.boolean() 
                        ? faker.date.between({ from: dateCreation, to: new Date() })
                        : dateCreation;

                    commentaires.push({
                        description: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
                        dateCreation: dateCreation,
                        dateModif: dateModif,
                        projetId: projet.id,
                        utilisateurId: faker.number.int({ min: 1, max: 300 }),
                    });
                }

                if (projet.id % 50 === 0) {
                    logMessage(`Sous-étape 1/2 - Génération des commentaires pour le projet ${projet.id} terminée`, COLOR_GREEN);
                }
            }

            logMessage("Sous-étape 2/2 : Insertion des commentaires en base de données", COLOR_YELLOW);

            await queryInterface.bulkInsert("commentaire", commentaires, {});
            logMessage("Sous-étape 2/2 - Insertion des commentaires réussie", COLOR_GREEN);

        } catch (error) {
            logMessage("Erreur lors de l'insertion des commentaires", COLOR_RED);
            console.error("Erreur lors de l'insertion des commentaires:", error);
            throw error;
        }

        logMessage("Étape 9/10 - Génération et insertion des commentaires terminée", COLOR_GREEN);
    },

    down: async (queryInterface, Sequelize) => {
        logMessage("Étape 9/2 : Suppression des commentaires en base de données", COLOR_YELLOW);

        try {
            await queryInterface.bulkDelete("commentaire", null, {});
            logMessage("Suppression des commentaires réussie", COLOR_GREEN);
        } catch (error) {
            logMessage("Erreur lors de la suppression des commentaires", COLOR_RED);
            console.error("Erreur lors de la suppression des commentaires:", error);
            throw error;
        }
    },
};
