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
            nom: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            dateCreation: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            dateModif: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            projetId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Projet",
                    key: "id",
                },
            },
        },
        {
            sequelize,
            modelName: "ImageProjet",
            tableName: "imageProjet",
            timestamps: false,
        }
    );
    return ImageProjet;
};
