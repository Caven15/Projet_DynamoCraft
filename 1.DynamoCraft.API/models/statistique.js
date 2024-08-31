"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Statistique extends Model {}
    Statistique.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nombreApreciation: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            nombreTelechargement: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            datePublication: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            dateModification: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "statistique",
            tableName: "statistique",
            timestamps: false,
        }
    );
    return Statistique;
};
