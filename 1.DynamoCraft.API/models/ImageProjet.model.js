const imageProjetModel = (sequelize, DataTypes) => {
    const ImageProjet = sequelize.define('imageProjet', {
        id: {
            type: DataTypes.STRING(200),
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
        tableName: 'imageProjet',
        timestamps: false
    });

    return ImageProjet;
};

module.exports = imageProjetModel;
