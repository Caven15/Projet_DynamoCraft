"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Modele3D extends Model {}
    Modele3D.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nom: DataTypes.STRING,
            dateCreation: DataTypes.DATE,
            dateModif: DataTypes.DATE,
            projetId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "modele3D",
            tableName: "modele3D",
            timestamps: false,
        }
    );
    return Modele3D;
};
