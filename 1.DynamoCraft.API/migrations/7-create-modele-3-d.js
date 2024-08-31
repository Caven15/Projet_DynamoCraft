/** @type {import('sequelize-cli').Migration} */
module.exports = {
    version: 10,
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("modele3d", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nom: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            dateCreation: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            dateModif: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal(
                    "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
                ),
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
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("modele3d");
    },
};
