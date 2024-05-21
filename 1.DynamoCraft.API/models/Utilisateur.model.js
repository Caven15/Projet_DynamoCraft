const utilisateurModel = (sequelize, DataTypes) => {
    const Utilisateur = sequelize.define('Utilisateur', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        pseudo: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        dateNaissance: {
            type: DataTypes.DATE,
            allowNull: false
        },
        biographie: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        centreInterets: {
            type: DataTypes.STRING(200),
            allowNull: false
        }
    }, {
        tableName: 'utilisateur',
        timestamps: false
    });

    return Utilisateur;
};

module.exports = utilisateurModel;
