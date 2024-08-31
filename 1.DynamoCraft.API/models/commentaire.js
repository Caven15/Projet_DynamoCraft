"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Commentaire extends Model {}
    Commentaire.init(
        {
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            dateCreation: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW, 
            },
            dateModif: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            projetId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            utilisateurId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "commentaire",
            tableName: "commentaire",
            timestamps: false,
        }
    );
    return Commentaire;
};
