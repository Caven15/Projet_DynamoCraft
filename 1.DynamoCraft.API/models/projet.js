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
            nom: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true,
            },
            description: {
                type: DataTypes.TEXT,
            },
            estValide: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            commentaire_admin: {
                type: DataTypes.TEXT,
            },
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
