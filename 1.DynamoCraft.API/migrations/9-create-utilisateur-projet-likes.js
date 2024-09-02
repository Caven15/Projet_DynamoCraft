"use strict";

module.exports = {
    version: 12,
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("utilisateurProjetLike", {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            utilisateurId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "utilisateur",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            projetId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "projet",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            dateLike: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
                validate: {
                    isBefore: {
                        args: [new Date().toISOString()],
                        msg: 'La dateLike doit être avant la date actuelle.',
                    },
                },
            },
        });

        await queryInterface.addIndex("utilisateurProjetLike", [
            "utilisateurId",
        ]);
        await queryInterface.addIndex("utilisateurProjetLike", ["projetId"]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("utilisateurProjetLike");
    },
};
