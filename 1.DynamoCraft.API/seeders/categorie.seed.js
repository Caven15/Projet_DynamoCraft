module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            "Categorie",
            [
                {
                    nom: "Objets décoratifs",
                },
                {
                    nom: "Pièces de rechange",
                },
                {
                    nom: "Jouets",
                },
                {
                    nom: "Bijoux",
                },
                {
                    nom: "Accessoires",
                },
                {
                    nom: "Prototypes",
                },
                {
                    nom: "Éducations",
                },
                {
                    nom: "Arts",
                },
                {
                    nom: "Gadgets",
                },
                {
                    nom: "Outils",
                },
            ],
            {}
        );
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("Categorie", null, {});
    },
};
