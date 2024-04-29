const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize_connection');

const modele3dModel = (sequelize, DataTypes) => {
    const Modele3D = sequelize.define('Modele3D', {
        id_modele_3d: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING(50)
        },
        id_projet: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'modele_3d',
        timestamps: false
    });

    // Association
    Modele3D.belongsTo(sequelize.models.Projet, { foreignKey: 'id_projet' });

    return Modele3D;
};

module.exports = modele3dModel;
