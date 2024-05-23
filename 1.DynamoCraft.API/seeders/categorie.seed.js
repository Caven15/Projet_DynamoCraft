module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Categorie', [
      {
        nom: 'Objets décoratifs',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Pièces de rechange',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Jouets',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Bijoux',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Accessoires',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Prototypes',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Éducation',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Art',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Gadgets',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nom: 'Outils',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categorie', null, {});
  }
};
