'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {

  }
  Utilisateur.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pseudo: DataTypes.STRING,
    email: DataTypes.STRING,
    dateNaissance: DataTypes.DATE,
    biographie: DataTypes.STRING,
    password: DataTypes.STRING,
    centreInterets: DataTypes.STRING,
    roleId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Utilisateur',
    tableName: 'Utilisateur',
  });
  return Utilisateur;
};
