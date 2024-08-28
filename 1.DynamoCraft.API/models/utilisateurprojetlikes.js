"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UtilisateurProjetLike extends Model {}
    UtilisateurProjetLike.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            utilisateurId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "utilisateur", // Table utilisateur en minuscule
                    key: "id",
                },
            },
            projetId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "projet", // Table projet en minuscule
                    key: "id",
                },
            },
            dateLike: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "UtilisateurProjetLike",
            tableName: "utilisateurProjetLike",
            timestamps: false,
        }
    );
    return UtilisateurProjetLike;
};
