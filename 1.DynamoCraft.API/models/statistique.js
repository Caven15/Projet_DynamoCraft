'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Statistique extends Model {
    static associate(models) {
      // Relation entre Statistique et Projet
      Statistique.belongsTo(models.Projet, {
        foreignKey: 'projetId'
      });
    }
  }
  Statistique.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreApreciation: DataTypes.INTEGER,
    nombreTelechargements: DataTypes.INTEGER,
    datePublication: DataTypes.DATE,
    dateModification: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Statistique',
  });
  return Statistique;
};
