"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {}
    Role.init(
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
            modelName: "role",
            tableName: "role",
            timestamps: false,
        }
    );
    return Role;
};
