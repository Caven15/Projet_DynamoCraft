require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

// Import des modèles Sequelize
const utilisateurModel = require("../models/utilisateur.model");
const roleModel = require("../models/role.model");
const categorieModel = require("../models/categorie.model");
const statistiqueModel = require("../models/statistique.model");
const statutModel = require("../models/statut.model");
const projetModel = require("../models/projet.model");
const imageUtilisateurModel = require("../models/imageUtilisateur.model");
const commentaireModel = require("../models/commentaire.model");
const modele3dModel = require("../models/modele3d.model");
const imageProjetModel = require("../models/imageProjet.model");
const utilisateurProjetModel = require("../models/utilisateurProjet.model");

let dbConnector;

module.exports = {
    connect: () => {
        if (!dbConnector) {
            const sequelize = new Sequelize(
                process.env.DB_NAME,
                process.env.DB_USER,
                process.env.DB_PASSWORD,
                {
                    host: process.env.DB_HOST,
                    dialect: "mysql",
                    port: 3306,
                    timezone: "+02:00"
                }
            );

            dbConnector = {
                Sequelize: Sequelize,
                sequelize: sequelize,
                Utilisateur: utilisateurModel(sequelize, DataTypes),
                Role: roleModel(sequelize, DataTypes),
                Categorie: categorieModel(sequelize, DataTypes),
                Statistique: statistiqueModel(sequelize, DataTypes),
                Statut: statutModel(sequelize, DataTypes),
                Projet: projetModel(sequelize, DataTypes),
                ImageUtilisateur: imageUtilisateurModel(sequelize, DataTypes),
                Commentaire: commentaireModel(sequelize, DataTypes),
                Modele3D: modele3dModel(sequelize, DataTypes),
                ImageProjet: imageProjetModel(sequelize, DataTypes),
                UtilisateurProjet: utilisateurProjetModel(sequelize, DataTypes)
            };

            // Définition des relations entre les modèles
            dbConnector.Utilisateur.hasOne(dbConnector.ImageUtilisateur);
            dbConnector.ImageUtilisateur.belongsTo(dbConnector.Utilisateur);

            dbConnector.Projet.hasMany(dbConnector.Commentaire);
            dbConnector.Commentaire.belongsTo(dbConnector.Projet);

            dbConnector.Projet.hasMany(dbConnector.Modele3D);
            dbConnector.Modele3D.belongsTo(dbConnector.Projet);

            dbConnector.Projet.hasMany(dbConnector.ImageProjet);
            dbConnector.ImageProjet.belongsTo(dbConnector.Projet);

            dbConnector.Utilisateur.belongsToMany(dbConnector.Projet, { through: dbConnector.UtilisateurProjet });
            dbConnector.Projet.belongsToMany(dbConnector.Utilisateur, { through: dbConnector.UtilisateurProjet });

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
