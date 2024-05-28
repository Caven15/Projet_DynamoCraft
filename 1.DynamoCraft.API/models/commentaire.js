const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commentaire extends Model {
    
  }
  commentaire.init({
    description: DataTypes.STRING,
    dateCreation: DataTypes.DATE,
    dateModif: DataTypes.DATE,
    projetId: DataTypes.INTEGER,
    utilisateurId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Commentaire',
    tableName: 'Commentaire',
    timestamps: false
  });
  return commentaire;
};