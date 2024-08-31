/** @type {import('sequelize-cli').Migration} */
module.exports = {
    version: 2,
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("role", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nom: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("role");
    },
};
