/** @type {import('sequelize-cli').Migration} */
module.exports = {
    version: 3,
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("statistique", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nombreApreciation: {
                type: Sequelize.INTEGER,
            },
            nombreTelechargement: {
                type: Sequelize.INTEGER,
            },
            datePublication: {
                type: Sequelize.DATE,
            },
            dateModification: {
                type: Sequelize.DATE,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("statistique");
    },
};
