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
            nombreApreciation: DataTypes.INTEGER,
            nombreTelechargement: DataTypes.INTEGER,
            datePublication: DataTypes.DATE,
            dateModification: DataTypes.DATE,
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
