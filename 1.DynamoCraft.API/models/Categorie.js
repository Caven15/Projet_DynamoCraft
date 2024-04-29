const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize_connection');

const categorieModel = (sequelize, DataTypes) => {
  const Categorie = sequelize.define('Categorie', {
    id_categorie: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'categorie',
    timestamps: false
  });

  return Categorie;
};

module.exports = categorieModel;
