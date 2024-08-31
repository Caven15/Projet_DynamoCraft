"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class UtilisateurProjet extends Model {}

    UtilisateurProjet.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            dateTelechargement: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW, // Définit la date de téléchargement par défaut à la date actuelle
            },
            utilisateurId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "utilisateur",
                    key: "id",
                },
            },
            projetId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "projet",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            modelName: "UtilisateurProjet",
            tableName: "utilisateurProjet",
            timestamps: false,
        }
    );

    return UtilisateurProjet;
};
