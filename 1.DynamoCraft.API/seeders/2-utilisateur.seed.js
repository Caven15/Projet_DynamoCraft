const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const utilisateurs = [];
        const hashedPassword = await bcrypt.hash('Test!1234', 10); // Hachage du mot de passe "Test!1234"

        const startDate = new Date(2022, 0, 1); // 1er janvier 2022
        const endDate = new Date(2023, 11, 31); // 31 décembre 2023

        for (let i = 0; i < 300; i++) {
            const randomDate = new Date(
                startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
            );

            utilisateurs.push({
                pseudo: faker.internet.userName(),
                email: faker.internet.email(),
                dateNaissance: faker.date.past(50, '2004-01-01'),
                biographie: faker.lorem.sentences(3),
                password: hashedPassword, // Utilisation du mot de passe crypté
                centreInterets: faker.lorem.words(5),
                dateInscription: randomDate,
                dateModif: randomDate,
                roleId: faker.datatype.number({ min: 1, max: 3 }),
                statutCompte: faker.datatype.boolean(),
            });
        }

        await queryInterface.bulkInsert('utilisateur', utilisateurs, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('utilisateur', null, {});
    },
};
