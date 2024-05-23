'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    static associate(models) {
      // Relation entre Utilisateur et Role
      Utilisateur.belongsTo(models.Role, {
        foreignKey: 'roleId'
      });
    }
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
    centreInterets: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Utilisateur',
  });
  return Utilisateur;
};
