/** @type {import('sequelize-cli').Migration} */
module.exports = {
    version: 11,
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("utilisateurProjet", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            dateTelechargement: {
                type: Sequelize.DATE,
            },
            utilisateurId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "utilisateur",
                    },
                    key: "id",
                },
                allowNull: false,
            },
            projetId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "projet",
                    },
                    key: "id",
                },
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("utilisateurProjet");
    },
};
