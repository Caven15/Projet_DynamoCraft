const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Categorie extends Model {}
    Categorie.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            nom: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "categorie",
            tableName: "categorie",
            timestamps: false,
        }
    );
    return Categorie;
};
