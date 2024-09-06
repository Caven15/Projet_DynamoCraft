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
            dateLike: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
                validate: {
                    isDate: true
                },
            },
        },
        {
            sequelize,
            modelName: "UtilisateurProjetLike",
            tableName: "utilisateurProjetLike",
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ["utilisateurId", "projetId"],
                    name: "unique_utilisateur_projet_like",
                },
            ],
        }
    );
    return UtilisateurProjetLike;
};
