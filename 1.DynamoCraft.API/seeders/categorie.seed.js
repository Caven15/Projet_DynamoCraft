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
<<<<<<< HEAD
                    nom: "Éducation",
=======
                    nom: "Éducations",
>>>>>>> 5d2bb88eaa554108c2dbc2ff41a57a28e512ebbb
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
