const imageUtilisateurModel = (sequelize, DataTypes) => {
    const ImageUtilisateur = sequelize.define('imageUtilisateur', {
        id: {
            type: DataTypes.STRING(200),
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        tableName: 'imageUtilisateur',
        timestamps: false
    });

    return ImageUtilisateur;
};

module.exports = imageUtilisateurModel;
