'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Modele3D extends Model {
    
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
    tableName: 'Modele3D',
    timestamps: false
  });
  return Modele3D;
};
