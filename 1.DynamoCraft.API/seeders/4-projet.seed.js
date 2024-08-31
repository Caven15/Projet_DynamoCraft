const { faker } = require("@faker-js/faker");

module.exports = {
    up: async (queryInterface, Sequelize) => {
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

        for (let i = 1; i <= 300; i++) {
            const categorieId = faker.number.int({ min: 1, max: 10 });
            const categorieNom = categories[categorieId - 1];

            const nom = `${categorieNom} - ${faker.commerce.productName()}_${i}`;
            const description = faker.commerce.productDescription();

            const nombreApreciation = faker.number.int({ min: 0, max: 500 });
            const nombreTelechargement = faker.number.int({
                min: 0,
                max: 1000,
            });

            // Insertion d'une statistique et récupération de l'ID
            await queryInterface.bulkInsert(
                "statistique",
                [
                    {
                        nombreApreciation,
                        nombreTelechargement,
                        datePublication: faker.date.past({ years: 2 }),
                        dateModification: faker.date.recent(),
                    },
                ],
                {}
            );

            // Récupération de l'ID de la statistique insérée
            const [statistique] = await queryInterface.sequelize.query(
                "SELECT LAST_INSERT_ID() as id;",
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            const statutId = [1, 1, 2, 3][Math.floor(Math.random() * 4)];
            const estValide = Math.random() < 0.66;

            projets.push({
                nom,
                description,
                estvalide: estValide,
                commentaire_admin: faker.lorem.sentence(),
                statutId: statutId,
                statistiqueId: statistique.id,
                categorieId: categorieId,
                utilisateurId: faker.number.int({ min: 1, max: 300 }),
            });
        }

        try {
            await queryInterface.bulkInsert("projet", projets, {});
        } catch (error) {
            console.error("Erreur lors de l'insertion du projet:", error);
            throw error;
        }
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("projet", null, {});
    },
};
