/** @type {import('sequelize-cli').Migration} */
module.exports = {
    version: 9,
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("commentaire", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            description: {
                type: Sequelize.TEXT, // Utilisation de TEXT pour des commentaires plus longs
                allowNull: false, // Obliger la présence d'une description
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
                    model: "projet",
                    key: "id",
                },
                allowNull: false,
                onDelete: "CASCADE", 
            },
            utilisateurId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "utilisateur",
                    key: "id",
                },
                allowNull: false,
                onDelete: "CASCADE",
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("commentaire");
    },
};
