/** @type {import('sequelize-cli').Migration} */
module.exports = {
    version: 5,
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("utilisateur", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            pseudo: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            dateNaissance: {
                type: Sequelize.DATE,
            },
            biographie: {
                type: Sequelize.STRING,
            },
            password: {
                type: Sequelize.STRING,
            },
            centreInterets: {
                type: Sequelize.STRING,
            },
            dateInscription: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            dateModif: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            roleId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "role",
                    },
                    key: "id",
                },
                allowNull: false,
            },
            statutCompte: {
                type: Sequelize.BOOLEAN,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("utilisateur");
    },
};
