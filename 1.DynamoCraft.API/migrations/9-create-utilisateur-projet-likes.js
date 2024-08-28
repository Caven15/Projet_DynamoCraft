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
                    model: {
                        tableName: "utilisateur", // Table utilisateur en minuscule
                    },
                    key: "id", // Clé primaire de l'utilisateur
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            projetId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: "projet", // Table projet en minuscule
                    },
                    key: "id", // Clé primaire du projet
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
            dateLike: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("utilisateurProjetLike");
    },
};
