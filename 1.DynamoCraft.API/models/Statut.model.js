const statutModel = (sequelize, DataTypes) => {
  const Statut = sequelize.define('statut', {
    id: {
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
