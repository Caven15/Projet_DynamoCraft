const { DataTypes } = require('sequelize');

const statutModel = (sequelize, DataTypes) => {
  const Statut = sequelize.define('Statut', {
    id_statut: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nom: {
      type: DataTypes.STRING(50)
    }
  }, {
    tableName: 'statut',
    timestamps: false
  });

  return Statut;
};

module.exports = statutModel;
