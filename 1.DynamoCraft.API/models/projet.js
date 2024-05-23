// models/projet.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Projet extends Model {
    
  }
  Projet.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: DataTypes.STRING,
    estvalide: DataTypes.BOOLEAN,
    commentaire_admin: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Projet',
  });
  return Projet;
};
