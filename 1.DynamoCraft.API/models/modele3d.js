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
    nom: DataTypes.STRING,
    dateCreation: DataTypes.DATE,
    dateModif: DataTypes.DATE,
    projetId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Modele3D',
    tableName: 'Modele3D',
    timestamps: false
  });
  return Modele3D;
};
