'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commentaire extends Model {
    
  }
  commentaire.init({
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'commentaire',
  });
  return commentaire;
};