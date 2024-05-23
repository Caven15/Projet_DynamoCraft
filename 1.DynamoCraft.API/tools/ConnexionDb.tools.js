require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// Import des modèles Sequelize
const utilisateurModel = require("../models/utilisateur");
const roleModel = require("../models/role");
const categorieModel = require("../models/categorie");
const statistiqueModel = require("../models/statistique");
const statutModel = require("../models/statut");
const projetModel = require("../models/projet");
const imageUtilisateurModel = require("../models/imageutilisateur");
const commentaireModel = require("../models/commentaire");
const modele3dModel = require("../models/modele3d");
const imageProjetModel = require("../models/imageprojet");
const utilisateurProjetModel = require("../models/utilisateurprojet");

let dbConnector;

module.exports = {
    connect: () => {
        if (!dbConnector) {
            const sequelize = new Sequelize(
                process.env.DBNAME,
                process.env.DBUSER,
                process.env.DBPASSWORD,
                {
                    host: process.env.DBHOST,
                    dialect: "mysql",
                    port: process.env.PORT,
                    timezone: "+02:00"
                }
            );

            dbConnector = {
                Sequelize: Sequelize,
                sequelize: sequelize,
                Role: roleModel(sequelize, DataTypes),
                Statut: statutModel(sequelize, DataTypes),
                Categorie: categorieModel(sequelize, DataTypes),
                Statistique: statistiqueModel(sequelize, DataTypes),
                Utilisateur: utilisateurModel(sequelize, DataTypes),
                ImageUtilisateur: imageUtilisateurModel(sequelize, DataTypes),
                Projet: projetModel(sequelize, DataTypes),
                ImageProjet: imageProjetModel(sequelize, DataTypes),
                Modele3D: modele3dModel(sequelize, DataTypes),
                Commentaire: commentaireModel(sequelize, DataTypes),
                UtilisateurProjet: utilisateurProjetModel(sequelize, DataTypes)
            };

            // Relation entre Utilisateur et Role
            dbConnector.Utilisateur.belongsTo(dbConnector.Role);
            dbConnector.Role.hasMany(dbConnector.Utilisateur);

            // Relation entre Utilisateur et ImageUtilisateur
            dbConnector.Utilisateur.hasOne(dbConnector.ImageUtilisateur);
            dbConnector.ImageUtilisateur.belongsTo(dbConnector.Utilisateur);

            // Relation entre Projet et Utilisateur
            dbConnector.Projet.belongsTo(dbConnector.Utilisateur);
            dbConnector.Utilisateur.hasMany(dbConnector.Projet);

            // Relation entre Projet et Statut
            dbConnector.Projet.belongsTo(dbConnector.Statut);
            dbConnector.Statut.hasMany(dbConnector.Projet);

            // Relation entre Projet et Statistique
            dbConnector.Projet.belongsTo(dbConnector.Statistique);
            dbConnector.Statistique.hasOne(dbConnector.Projet);

            // Relation entre Projet et Categorie
            dbConnector.Projet.belongsTo(dbConnector.Categorie);
            dbConnector.Categorie.hasMany(dbConnector.Projet);

            // Relation entre Projet et UtilisateurProjet
            dbConnector.Projet.belongsToMany(dbConnector.Utilisateur, { through: dbConnector.UtilisateurProjet });
            dbConnector.Utilisateur.belongsToMany(dbConnector.Projet, { through: dbConnector.UtilisateurProjet });

            // Relation entre Projet et Commentaire
            dbConnector.Projet.hasOne(dbConnector.Commentaire);
            dbConnector.Commentaire.belongsTo(dbConnector.Projet);

            // Relation entre Projet et Modele3D
            dbConnector.Projet.hasMany(dbConnector.Modele3D);
            dbConnector.Modele3D.belongsTo(dbConnector.Projet);

            // Relation entre Projet et ImageProjet
            dbConnector.Projet.hasOne(dbConnector.ImageProjet);
            dbConnector.ImageProjet.belongsTo(dbConnector.Projet);

            // Synchronisation avec la base de données (décommentez si nécessaire)
            // dbConnector.sequelize.sync({ force: true });
        }
    },

    get: () => {
        if (!dbConnector)
            this.connect;
        else
            return dbConnector;
    }
};
