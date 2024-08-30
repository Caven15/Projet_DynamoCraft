// models/projet.js
"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Projet extends Model {}
    Projet.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nom: DataTypes.STRING,
            description: DataTypes.STRING,
            estValide: DataTypes.BOOLEAN,
            commentaire_admin: DataTypes.STRING,
            statutId: DataTypes.INTEGER,
            statistiqueId: DataTypes.INTEGER,
            categorieId: DataTypes.INTEGER,
            utilisateurId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "projet",
            tableName: "projet",
            timestamps: false,
        }
    );
    return Projet;
};
