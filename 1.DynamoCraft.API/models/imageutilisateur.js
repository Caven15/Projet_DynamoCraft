"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class ImageUtilisateur extends Model {}
    ImageUtilisateur.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nom: {
                type: DataTypes.STRING(255), // Limitation à 255 caractères
                allowNull: false,
            },
            dateAjout: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            dateModif: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            utilisateurId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "utilisateur",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
            },
        },
        {
            sequelize,
            modelName: "imageUtilisateur",
            tableName: "imageUtilisateur",
            timestamps: false, // Gérer manuellement les timestamps
            hooks: {
                beforeUpdate: (imageUtilisateur) => {
                    imageUtilisateur.dateModif = new Date();
                },
            },
        }
    );
    return ImageUtilisateur;
};
