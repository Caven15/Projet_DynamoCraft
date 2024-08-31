/** @type {import('sequelize-cli').Migration} */
module.exports = {
    version: 6,
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("imageUtilisateur", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nom: {
                type: Sequelize.STRING(255), // Limitation de la taille du nom du fichier à 255 caractères
                allowNull: false,
            },
            dateAjout: {
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
            utilisateurId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "utilisateur",
                    },
                    key: "id",
                },
                allowNull: false,
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("imageUtilisateur");
    },
};
