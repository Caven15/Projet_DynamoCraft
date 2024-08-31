"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Categorie extends Model {}
    Categorie.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nom: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true, 
                    len: [1, 50],
                },
            },
        },
        {
            sequelize,
            modelName: "categorie",
            tableName: "categorie",
            timestamps: false,
        }
    );
    return Categorie;
};
