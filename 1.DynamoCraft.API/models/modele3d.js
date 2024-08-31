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
            nom: {
                type: DataTypes.STRING(255), 
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
                references: {
                    model: "projet",
                    key: "id",
                },
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            },
        },
        {
            sequelize,
            modelName: "Modele3D",
            tableName: "modele3d",
            timestamps: false,
        }
    );
    return Modele3D;
};
