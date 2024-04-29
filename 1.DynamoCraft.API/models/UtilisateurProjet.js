const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize_connection');

const utilisateurProjetModel = (sequelize, DataTypes) => {
    const UtilisateurProjet = sequelize.define('UtilisateurProjet', {
        id_utilisateur: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        id_projet: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        date_telechargement: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'utilisateur_projet',
        timestamps: false
    });

    // Associations
    UtilisateurProjet.belongsTo(sequelize.models.Utilisateur, { foreignKey: 'id_utilisateur' });
    UtilisateurProjet.belongsTo(sequelize.models.Projet, { foreignKey: 'id_projet' });

    return UtilisateurProjet;
};

module.exports = utilisateurProjetModel;
