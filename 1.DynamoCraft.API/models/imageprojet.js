'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ImageProjet extends Model {
    static associate(models) {
      // Relation entre ImageProjet et Projet
      ImageProjet.belongsTo(models.Projet, {
        foreignKey: 'projetId'
      });
    }
  }
  ImageProjet.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ImageProjet',
  });
  return ImageProjet;
};
