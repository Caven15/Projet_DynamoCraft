'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  version: 6,
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('imageUtilisateur', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      utilisateurId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'utilisateur',
          },
          key: 'id',
        },
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('imageUtilisateur');
  }
};