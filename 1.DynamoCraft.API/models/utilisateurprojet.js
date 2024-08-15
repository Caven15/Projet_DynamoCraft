"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class UtilisateurProjet extends Model {}
    UtilisateurProjet.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            dateTelechargement: DataTypes.DATE,
            utilisateurId: DataTypes.INTEGER,
            projetId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "UtilisateurProjet",
            tableName: "UtilisateurProjet",
            timestamps: false,
        }
    );
    return UtilisateurProjet;
};
