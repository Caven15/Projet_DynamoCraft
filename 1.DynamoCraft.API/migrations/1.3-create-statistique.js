/** @type {import('sequelize-cli').Migration} */
module.exports = {
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
                allowNull: false,
                defaultValue: 0,
            },
            nombreTelechargement: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            datePublication: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            dateModification: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("statistique");
    },
};
