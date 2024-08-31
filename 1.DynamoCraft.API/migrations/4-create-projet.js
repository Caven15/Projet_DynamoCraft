/** @type {import('sequelize-cli').Migration} */
module.exports = {
    version: 7,
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("projet", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            nom: {
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true,
            },
            description: {
                type: Sequelize.TEXT, 
            },
            estvalide: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            commentaire_admin: {
                type: Sequelize.TEXT, 
            },
            statutId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "statut",
                    },
                    key: "id",
                },
                allowNull: false,
            },
            statistiqueId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "statistique",
                    },
                    key: "id",
                },
                allowNull: false,
            },
            categorieId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "categorie",
                    },
                    key: "id",
                },
                allowNull: false,
            },
            utilisateurId: {
                type: Sequelize.INTEGER,
                references: {
                    model: {
                        tableName: "utilisateur",
                    },
                    key: "id",
                },
                allowNull: false,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("projet");
    },
};
