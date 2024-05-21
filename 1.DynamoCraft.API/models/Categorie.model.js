const categorieModel = (sequelize, DataTypes) => {
  const Categorie = sequelize.define('categorie', {
    id: {
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
