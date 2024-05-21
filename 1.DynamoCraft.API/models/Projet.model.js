const projetModel = (sequelize, DataTypes) => {
    const Projet = sequelize.define('projet', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        estValide: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        commentaire_admin: {
            type: DataTypes.STRING(250)
        }
    }, {
        tableName: 'projet',
        timestamps: false
    });

    return Projet;
};

module.exports = projetModel;
