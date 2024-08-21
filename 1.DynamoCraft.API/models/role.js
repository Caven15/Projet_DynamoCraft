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
            nom: DataTypes.STRING,
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
