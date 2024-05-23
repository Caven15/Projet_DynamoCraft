'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('statistiques', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombreApreciation: {
        type: Sequelize.INTEGER
      },
      nombreTelechargements: {
        type: Sequelize.INTEGER
      },
      datePublication: {
        type: Sequelize.DATE
      },
      dateModification: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('statistiques');
  }
};