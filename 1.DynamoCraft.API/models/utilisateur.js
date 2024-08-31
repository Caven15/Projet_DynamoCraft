"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Utilisateur extends Model {}
    Utilisateur.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            pseudo: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                    len: [3, 50],
                },
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                    notEmpty: true,
                },
            },
            dateNaissance: {
                type: DataTypes.DATEONLY,
                allowNull: true,
            },
            biographie: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
            centreInterets: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            statutCompte: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            dateInscription: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            dateModif: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            resetPasswordToken: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            resetPasswordExpires: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            loginAttempts: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            lockUntil: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "utilisateur",
            tableName: "utilisateur",
            timestamps: false,
        }
    );
    return Utilisateur;
};
