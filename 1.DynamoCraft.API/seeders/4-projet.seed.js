const fs = require("fs");
const path = require("path");
const { faker } = require("@faker-js/faker");
const {
    logMessage,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logMessage(
            "Étape 7/1 : Génération et insertion des projets avec statistiques",
            COLOR_YELLOW
        );

        const projets = [];
        const categories = [
            "Objets décoratifs",
            "Pièces de rechange",
            "Jouets",
            "Bijoux",
            "Accessoires",
            "Prototypes",
            "Éducation",
            "Arts",
            "Gadgets",
            "Outils",
        ];

        const utilisateurs = new Set(); // Pour stocker les utilisateurs déjà utilisés
        const MAX_UTILISATEURS = 300; // Assurez-vous que ce nombre correspond au nombre total d'utilisateurs dans votre base de données

        logMessage("Sous-étape 1/3 : Génération des projets", COLOR_YELLOW);

        for (let i = 1; i <= 300; i++) {
            const categorieId = faker.number.int({ min: 1, max: 10 });
            const categorieNom = categories[categorieId - 1];

            let nom = `${faker.commerce.productName()}`;

            // Ajout d'un suffixe unique pour éviter les doublons
            const suffixeUnique = `${i}-${Date.now()}`;
            nom = `${nom}-${suffixeUnique}`;

            const description = faker.commerce.productDescription();

            const nombreApreciation = faker.number.int({ min: 0, max: 500 });
            const nombreTelechargement = faker.number.int({
                min: 0,
                max: 1000,
            });

            // Sous-étape 2/3 : Insertion d'une statistique et récupération de l'ID
            logMessage(`Sous-étape 2/3 : Insertion de la statistique pour le projet ${i}`, COLOR_YELLOW);
            
            await queryInterface.bulkInsert(
                "statistique",
                [
                    {
                        nombreApreciation,
                        nombreTelechargement,
                        datePublication: faker.date.past({ years: 2 }),
                        dateModification: faker.date.recent(),
                    },
                ]
            );

            const [statistique] = await queryInterface.sequelize.query(
                "SELECT LAST_INSERT_ID() as id;",
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            const statistiqueId = statistique.id;

            // Assigner un utilisateur unique
            let utilisateurId;
            do {
                utilisateurId = faker.number.int({ min: 1, max: MAX_UTILISATEURS });
            } while (utilisateurs.has(utilisateurId));

            utilisateurs.add(utilisateurId);

            projets.push({
                nom,
                description,
                estvalide: Math.random() < 0.66,
                commentaire_admin: faker.lorem.sentence(),
                statutId: [1, 1, 2, 3][Math.floor(Math.random() * 4)],
                statistiqueId: statistiqueId,
                categorieId: categorieId,
                utilisateurId: utilisateurId,
            });

            if (i % 50 === 0) {
                logMessage(
                    `Sous-étape 2/3 - Insertion de la statistique pour le projet ${i}/300 terminée`,
                    COLOR_GREEN
                );
            }
        }

        logMessage(
            "Sous-étape 3/3 : Insertion des projets en base de données",
            COLOR_YELLOW
        );

        try {
            await queryInterface.bulkInsert("projet", projets, {});
            logMessage(
                "Sous-étape 3/3 - Insertion des projets réussie",
                COLOR_GREEN
            );
        } catch (error) {
            logMessage(
                "Sous-étape 3/3 - Erreur lors de l'insertion des projets",
                COLOR_RED
            );
            console.error("Erreur lors de l'insertion du projet:", error);
            throw error;
        }

        logMessage(
            "Étape 7/10 - Génération et insertion des projets terminée",
            COLOR_GREEN
        );
    },

    down: async (queryInterface, Sequelize) => {
        logMessage(
            "Étape 7/2 : Suppression des projets en base de données",
            COLOR_YELLOW
        );

        try {
            await queryInterface.bulkDelete("projet", null, {});
            logMessage("Suppression des projets réussie", COLOR_GREEN);
        } catch (error) {
            logMessage("Erreur lors de la suppression des projets", COLOR_RED);
            console.error("Erreur lors de la suppression des projets:", error);
            throw error;
        }
    },
};
