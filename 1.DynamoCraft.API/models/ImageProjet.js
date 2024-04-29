const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize_connection');

const imageProjetModel = (sequelize, DataTypes) => {
    const ImageProjet = sequelize.define('ImageProjet', {
        id_image_utilisateur: {
            type: DataTypes.STRING(200),
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        id_projet: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'image_projet',
        timestamps: false
    });

    // Association
    ImageProjet.belongsTo(sequelize.models.Projet, { foreignKey: 'id_projet' });

    return ImageProjet;
};

module.exports = imageProjetModel;
