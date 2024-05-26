'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  version: 9,
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('commentaire', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING
      },
      dateCreation: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      dateModif: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      projetId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'projet',
          },
          key: 'id',
        },
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('commentaire');
  }
};