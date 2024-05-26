'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  version: 4,
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categorie', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categorie');
  }
};
