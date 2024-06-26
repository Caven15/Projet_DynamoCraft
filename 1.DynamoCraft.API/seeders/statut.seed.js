module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Insérer des données dans la base de données
        await queryInterface.bulkInsert(
            "statut",
            [
                {
                    nom: "Valide",
                },
                {
                    nom: "Invalide",
                },
                {
                    nom: "En attente",
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        // Supprimer les données insérées
        await queryInterface.bulkDelete("statut", null, {});
    },
};
