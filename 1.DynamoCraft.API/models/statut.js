"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Statut extends Model {}
    Statut.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nom: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "statut",
            tableName: "statut",
            timestamps: false,
        }
    );
    return Statut;
};
