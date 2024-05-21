const commentaireModel = (sequelize, DataTypes) => {
    const Commentaire = sequelize.define('commentaire', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        description: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        datePost: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'commentaire',
        timestamps: false
    });

    return Commentaire;
};

module.exports = commentaireModel;
