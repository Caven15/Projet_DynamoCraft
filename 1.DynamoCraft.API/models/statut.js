'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Statut extends Model {
    static associate(models) {
      // Relation entre Statut et Projet
      Statut.hasMany(models.Projet, {
        foreignKey: 'statutId'
      });
    }
  }
  Statut.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Statut',
  });
  return Statut;
};
