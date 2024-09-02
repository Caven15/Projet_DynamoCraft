const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { logMessage, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } = require("../tools/logs.tools");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logMessage("Étape 5/1 : Insertion des utilisateurs dans la base de données", COLOR_YELLOW);

        const utilisateurs = [];

        try {
            // Sous-étape 1/3 : Hachage du mot de passe
            logMessage("Sous-étape 1/3 : Hachage du mot de passe 'Test!1234'", COLOR_YELLOW);
            const hashedPassword = await bcrypt.hash('Test!1234', 10);
            logMessage("Mot de passe haché avec succès", COLOR_GREEN);

            const startDate = new Date(2022, 0, 1); // 1er janvier 2022
            const endDate = new Date(2023, 11, 31); // 31 décembre 2023

            // Sous-étape 2/3 : Génération des données utilisateurs
            logMessage("Sous-étape 2/3 : Génération des données utilisateurs", COLOR_YELLOW);
            for (let i = 0; i < 300; i++) {
                const randomDate = new Date(
                    startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
                );

                utilisateurs.push({
                    pseudo: faker.internet.userName(),
                    email: faker.internet.email(),
                    dateNaissance: faker.date.past({ years: 50, refDate: '2004-01-01' }),
                    biographie: faker.lorem.sentences(3),
                    password: hashedPassword, // Utilisation du mot de passe crypté
                    centreInterets: faker.lorem.words(5),
                    dateInscription: randomDate,
                    dateModif: randomDate,
                    roleId: faker.datatype.number({ min: 1, max: 3 }),
                    statutCompte: faker.datatype.boolean(),
                });
            }
            logMessage("Données utilisateurs générées avec succès", COLOR_GREEN);

            // Sous-étape 3/3 : Insertion des utilisateurs dans la base de données
            logMessage("Sous-étape 3/3 : Insertion des utilisateurs dans la table 'utilisateur'", COLOR_YELLOW);
            await queryInterface.bulkInsert('utilisateur', utilisateurs, {});
            logMessage("Insertion des utilisateurs réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de l'insertion des utilisateurs : ${error.message}`, COLOR_RED);
        }
    },

    down: async (queryInterface, Sequelize) => {
        logMessage("Étape 5/2 : Suppression des utilisateurs de la base de données", COLOR_YELLOW);

        try {
            await queryInterface.bulkDelete('utilisateur', null, {});
            logMessage("Suppression des utilisateurs réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de la suppression des utilisateurs : ${error.message}`, COLOR_RED);
        }
    },
};
