/** @type {import('sequelize-cli').Migration} */
module.exports = {
    version: 8,
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("imageProjet", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nom: {
                type: Sequelize.STRING,
            },
            dateCreation: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            dateModif: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
        await queryInterface.dropTable("imageProjet");
    },
};
