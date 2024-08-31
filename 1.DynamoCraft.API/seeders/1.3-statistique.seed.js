const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const statistiques = [];

        const startDate = new Date(2022, 0, 1); // 1er janvier 2022
        const endDate = new Date(2023, 11, 31); // 31 décembre 2023

        for (let i = 0; i < 300; i++) {
            const randomDate = new Date(
                startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
            );

            statistiques.push({
                nombreApreciation: faker.datatype.number({ min: 0, max: 500 }),
                nombreTelechargement: faker.datatype.number({ min: 0, max: 1000 }),
                datePublication: randomDate,
                dateModification: randomDate,
            });
        }

        await queryInterface.bulkInsert('statistique', statistiques, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('statistique', null, {});
    },
};
