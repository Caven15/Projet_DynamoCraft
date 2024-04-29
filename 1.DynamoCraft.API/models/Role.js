const { DataTypes } = require("sequelize");

const roleModel = (sequelize, DataTypes) =>{
    const role = sequelize.define('Role', {
        id_role: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        nom: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
        }, {
        tableName: 'role',
        timestamps: false
    })
    return role;
};

module.exports = roleModel