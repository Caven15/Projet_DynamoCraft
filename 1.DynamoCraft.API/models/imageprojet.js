"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ImageProjet extends Model {}
    ImageProjet.init(
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
            modelName: "ImageProjet",
            tableName: "ImageProjet",
            timestamps: false,
        }
    );
    return ImageProjet;
};
