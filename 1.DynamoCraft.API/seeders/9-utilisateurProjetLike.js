const { faker } = require("@faker-js/faker");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const likes = [];

        for (let i = 1; i <= 300; i++) {
            // Chaque utilisateur peut aimer un nombre aléatoire de projets
            const numberOfLikes = faker.number.int({ min: 1, max: 20 });

            for (let j = 0; j < numberOfLikes; j++) {
                likes.push({
                    utilisateurId: i,
                    projetId: faker.number.int({ min: 1, max: 300 }), // Projets entre 1 et 300
                    dateLike: faker.date.past(2), // Date dans les 2 dernières années
                });
            }
        }

        await queryInterface.bulkInsert("utilisateurProjetLike", likes, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("utilisateurProjetLike", null, {});
    },
};
