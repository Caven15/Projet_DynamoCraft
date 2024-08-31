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
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            utilisateurId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: "utilisateur",
                    },
                    key: "id",
                },
                onDelete: "CASCADE", // Supprimez la relation si l'utilisateur est supprimé
            },
            projetId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: "projet",
                    },
                    key: "id",
                },
                onDelete: "CASCADE", // Supprimez la relation si le projet est supprimé
            },
        });

        await queryInterface.addConstraint("utilisateurProjet", {
            fields: ["utilisateurId", "projetId"],
            type: "unique",
            name: "unique_utilisateur_projet",
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("utilisateurProjet");
    },
};
