const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize_connection');

const projetModel = (sequelize, DataTypes) => {
    const Projet = sequelize.define('Projet', {
        id_projet: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        est_valide: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        commentaire_admin: {
            type: DataTypes.STRING(250)
        },
        id_statut: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_statistique: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_categorie: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_utilisateur: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'projet',
        timestamps: false
    });

    // Associations
    Projet.belongsTo(sequelize.models.Statut, { foreignKey: 'id_statut' });
    Projet.belongsTo(sequelize.models.Statistique, { foreignKey: 'id_statistique' });
    Projet.belongsTo(sequelize.models.Categorie, { foreignKey: 'id_categorie' });
    Projet.belongsTo(sequelize.models.Utilisateur, { foreignKey: 'id_utilisateur' });

    return Projet;
};

module.exports = projetModel;
