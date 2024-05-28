'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ImageUtilisateur extends Model {
    
  }
  ImageUtilisateur.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: DataTypes.STRING,
    dateAjout: DataTypes.DATE,
    dateModif: DataTypes.DATE,
    utilisateurId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ImageUtilisateur',
    tableName: 'ImageUtilisateur',
    timestamps: false
  });
  return ImageUtilisateur;
};
