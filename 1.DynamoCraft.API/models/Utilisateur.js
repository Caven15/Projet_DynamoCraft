const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize_connection');

const utilisateurModel = (sequelize, DataTypes) => {
    const Utilisateur = sequelize.define('Utilisateur', {
        id_utilisateur: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        pseudo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        date_naissance: {
            type: DataTypes.DATE,
            allowNull: false
        },
        biographie: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        centre_interets: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        id_role: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'utilisateur',
        timestamps: false
    });

    return Utilisateur;
};

module.exports = utilisateurModel;
