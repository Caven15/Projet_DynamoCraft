const { DataTypes } = require('sequelize');

const statistiqueModel = (sequelize, DataTypes) => {
  const Statistique = sequelize.define('Statistique', {
    id_statistique: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nombre_apreciation: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre_telechargements: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_publication: {
      type: DataTypes.DATE,
      allowNull: false
    },
    date_modification: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'statistique',
    timestamps: false
  });

  return Statistique;
};

module.exports = statistiqueModel;
