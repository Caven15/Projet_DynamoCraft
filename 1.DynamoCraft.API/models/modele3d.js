'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Modele3D extends Model {
    static associate(models) {
      // Relation entre Modele3D et Projet
      Modele3D.belongsTo(models.Projet, {
        foreignKey: 'projetId'
      });
    }
  }
  Modele3D.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Modele3D',
  });
  return Modele3D;
};
