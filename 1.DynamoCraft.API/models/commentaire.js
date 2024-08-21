const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Commentaire extends Model {}
    Commentaire.init(
        {
            description: DataTypes.STRING,
            dateCreation: DataTypes.DATE,
            dateModif: DataTypes.DATE,
            projetId: DataTypes.INTEGER,
            utilisateurId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "commentaire",
            tableName: "commentaire",
            timestamps: false,
        }
    );
    return Commentaire;
};
