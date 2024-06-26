/** @type {import('sequelize-cli').Migration} */
module.exports = {
    version: 1,
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("statut", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nom: {
                type: Sequelize.STRING,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("statut");
    },
};
