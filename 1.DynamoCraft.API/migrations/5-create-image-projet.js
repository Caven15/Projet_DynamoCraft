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
                type: Sequelize.STRING(255), // Limite de taille définie
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

        // Ajout d'un index sur projetId pour améliorer les performances de requête
        await queryInterface.addIndex('imageProjet', ['projetId']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("imageProjet");
    },
};
