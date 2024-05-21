const statistiqueModel = (sequelize, DataTypes) => {
  const Statistique = sequelize.define('statistique', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    nombreApreciation: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombreTelechargements: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    datePublication: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dateModification: {
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
