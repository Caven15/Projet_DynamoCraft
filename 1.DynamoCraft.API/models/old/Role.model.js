const roleModel = (sequelize, DataTypes) =>{
    const Role = sequelize.define('role', {
        nom: {
            type: DataTypes.STRING(50),
            allowNull: false
        }
        }, {
        tableName: 'role',
        timestamps: false
    })
    return Role;
};

module.exports = roleModel