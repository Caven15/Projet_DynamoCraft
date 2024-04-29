const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize_connection');

const commentaireModel = (sequelize, DataTypes) => {
    const Commentaire = sequelize.define('Commentaire', {
        id_commentaire: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        date_post: {
            type: DataTypes.DATE,
            allowNull: false
        },
        id_projet: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'commentaire',
        timestamps: false
    });

    // Association
    Commentaire.belongsTo(sequelize.models.Projet, { foreignKey: 'id_projet' });

    return Commentaire;
};

module.exports = commentaireModel;
