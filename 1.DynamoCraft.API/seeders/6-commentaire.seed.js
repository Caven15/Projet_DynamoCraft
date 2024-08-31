const { faker } = require("@faker-js/faker");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const commentaires = [];

        for (let projetId = 1; projetId <= 300; projetId++) {
            const nombreCommentaires = faker.number.int({ min: 1, max: 20 });

            for (let i = 0; i < nombreCommentaires; i++) {
                const dateCreation = faker.date.past({ years: 2 });
                const dateModif =
                    faker.datatype.boolean() && faker.date.recent()
                        ? faker.date.between({
                              from: dateCreation,
                              to: new Date(),
                          })
                        : dateCreation;
                commentaires.push({
                    description: faker.lorem.sentences(
                        faker.number.int({ min: 1, max: 3 })
                    ),
                    dateCreation: dateCreation,
                    dateModif: dateModif,
                    projetId: projetId,
                    utilisateurId: faker.number.int({ min: 1, max: 300 }),
                });
            }
        }

        await queryInterface.bulkInsert("commentaire", commentaires, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("commentaire", null, {});
    },
};
