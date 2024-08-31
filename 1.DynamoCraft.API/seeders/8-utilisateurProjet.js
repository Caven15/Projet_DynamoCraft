const { faker } = require("@faker-js/faker");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const telechargements = [];
        const utilisateurs = Array.from({ length: 300 }, (_, i) => i + 1); 
        const projets = Array.from({ length: 300 }, (_, i) => i + 1); 

        // Pour chaque utilisateur
        utilisateurs.forEach((utilisateurId) => {
            // Nombre aléatoire de téléchargements pour chaque utilisateur (entre 1 et 50)
            const nombreTelechargements = faker.number.int({ min: 1, max: 50 });

            // Sélectionner des projets aléatoires pour cet utilisateur
            const projetsTelecharges = faker.helpers.arrayElements(
                projets,
                nombreTelechargements
            );

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

        // Insérer les enregistrements dans la table utilisateurProjet
        await queryInterface.bulkInsert(
            "utilisateurProjet",
            telechargements,
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("utilisateurProjet", null, {});
    },
};
