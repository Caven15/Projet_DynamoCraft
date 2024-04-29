const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize_connection');

const imageUtilisateurModel = (sequelize, DataTypes) => {
    const ImageUtilisateur = sequelize.define('ImageUtilisateur', {
        id_image_utilisateur: {
            type: DataTypes.STRING(200),
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        id_utilisateur: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'image_utilisateur',
        timestamps: false
    });

    // Association
    ImageUtilisateur.belongsTo(sequelize.models.Utilisateur, { foreignKey: 'id_utilisateur' });

    return ImageUtilisateur;
};

module.exports = imageUtilisateurModel;
