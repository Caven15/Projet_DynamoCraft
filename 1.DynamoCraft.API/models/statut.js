'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Statut extends Model {

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
    tableName: 'Statut',
  });
  return Statut;
};
