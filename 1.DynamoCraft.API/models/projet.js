'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Projet extends Model {
    static associate(models) {
      // Relation entre Projet et Utilisateur
      Projet.belongsTo(models.Utilisateur, {
        foreignKey: 'utilisateurId'
      });
      // Relation entre Projet et Statut
      Projet.belongsTo(models.Statut, {
        foreignKey: 'statutId'
      });
      // Relation entre Projet et Statistique
      Projet.belongsTo(models.Statistique, {
        foreignKey: 'statistiqueId'
      });
      // Relation entre Projet et Categorie
      Projet.belongsTo(models.Categorie, {
        foreignKey: 'categorieId'
      });
      // Relation entre Projet et UtilisateurProjet
      Projet.belongsToMany(models.Utilisateur, {
        through: models.UtilisateurProjet
      });
      // Relation entre Projet et Commentaire
      Projet.hasMany(models.Commentaire, {
        foreignKey: 'projetId'
      });
      // Relation entre Projet et Modele3D
      Projet.hasMany(models.Modele3D, {
        foreignKey: 'projetId'
      });
      // Relation entre Projet et ImageProjet
      Projet.hasOne(models.ImageProjet, {
        foreignKey: 'projetId'
      });
    }
  }
  Projet.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: DataTypes.STRING,
    estvalide: DataTypes.BOOLEAN,
    commentaire_admin: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Projet',
  });
  return Projet;
};
