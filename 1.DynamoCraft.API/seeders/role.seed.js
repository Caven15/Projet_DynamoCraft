'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insérer des données dans la base de données
    await queryInterface.bulkInsert('roles', [
      {
        nom: 'Utilisateur'
      },
      {
        nom: 'Modérateur'
      },
      {
        nom: 'Administrateur'
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Supprimer les données insérées
    await queryInterface.bulkDelete('roles', null, {});
  }
};
