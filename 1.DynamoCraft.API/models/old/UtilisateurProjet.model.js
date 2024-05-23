const utilisateurProjetModel = (sequelize, DataTypes) => {
    const UtilisateurProjet = sequelize.define('utilisateurProjet', {
        dateTelechargement: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'utilisateurProjet',
        timestamps: false
    });


    return UtilisateurProjet;
};

module.exports = utilisateurProjetModel;