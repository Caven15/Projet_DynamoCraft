const modele3dModel = (sequelize, DataTypes) => {
    const Modele3D = sequelize.define('modele3D', {
        id: {
            type: DataTypes.STRING(50),
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING(50)
        }
    }, {
        tableName: 'modele3d',
        timestamps: false
    });

    return Modele3D;
};

module.exports = modele3dModel;
