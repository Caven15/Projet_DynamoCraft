'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Relation entre Role et Utilisateur
      Role.hasMany(models.Utilisateur, {
        foreignKey: 'roleId'
      });
    }
  }
  Role.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    timestamps: false
  });
  return Role;
};
