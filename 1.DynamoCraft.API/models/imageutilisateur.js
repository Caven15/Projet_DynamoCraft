'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ImageUtilisateur extends Model {
    static associate(models) {
      // Relation entre ImageUtilisateur et Utilisateur
      ImageUtilisateur.belongsTo(models.Utilisateur, {
        foreignKey: 'utilisateurId'
      });
    }
  }
  ImageUtilisateur.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ImageUtilisateur',
  });
  return ImageUtilisateur;
};
