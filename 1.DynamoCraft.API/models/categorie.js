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
            modelName: "Categorie",
            tableName: "Categorie",
            timestamps: false,
        }
    );
    return Categorie;
};
