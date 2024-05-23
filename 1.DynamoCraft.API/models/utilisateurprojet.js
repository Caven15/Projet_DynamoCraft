'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UtilisateurProjet extends Model {
    static associate(models) {
      // Relation entre UtilisateurProjet, Utilisateur et Projet
      UtilisateurProjet.belongsTo(models.Utilisateur, {
        foreignKey: 'utilisateurId'
      });
      UtilisateurProjet.belongsTo(models.Projet, {
        foreignKey: 'projetId'
      });
    }
  }
  UtilisateurProjet.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dateTelechargement: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UtilisateurProjet',
  });
  return UtilisateurProjet;
};
