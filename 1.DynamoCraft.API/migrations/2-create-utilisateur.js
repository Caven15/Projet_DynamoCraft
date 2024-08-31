/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("utilisateur", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            pseudo: {
                type: Sequelize.STRING(50),
                allowNull: false,
                unique: true,
            },
            email: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            dateNaissance: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            biographie: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            centreInterets: {
                type: Sequelize.TEXT,
                allowNull: true,
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
                allowNull: false,
                defaultValue: true,
            },
            resetPasswordToken: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            resetPasswordExpires: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            loginAttempts: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            lockUntil: {
                type: Sequelize.DATE,
                allowNull: true,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("utilisateur");
    },
};
