const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { faker } = require("@faker-js/faker");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const images = [];
        const uploadDir = path.join(__dirname, "..", "uploads");

        // Vérifier si le dossier 'uploads' existe, sinon le créer
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }

        const imageSets = [];
        const numImageSets = 7;

        // Téléchargement des 7 sets d'images différents
        for (let setIndex = 1; setIndex <= numImageSets; setIndex++) {
            const imageSet = [];
            const fileName = `img_set_${Date.now()}.jpg`;
            const filePath = path.join(uploadDir, fileName);

            try {
                const response = await axios({
                    url: `https://picsum.photos/200/200`,
                    method: "GET",
                    responseType: "stream",
                });

                // Sauvegarder l'image téléchargée
                response.data.pipe(fs.createWriteStream(filePath));
                console.log(
                    `Téléchargement de l'image pour le set ${setIndex}`
                );

                imageSet.push(fileName);
            } catch (error) {
                console.error(
                    `Erreur lors du téléchargement de l'image pour le set ${setIndex}:`,
                    error.message
                );
            }

            imageSets.push(imageSet);
        }

        // Assigner les images des sets aux utilisateurs
        for (let i = 1; i <= 300; i++) {
            const setIndex = Math.floor((i - 1) / 7) % numImageSets;
            const fileName = imageSets[setIndex][0]; // Utiliser l'image du set correspondant

            images.push({
                nom: fileName,
                utilisateurId: i,
                dateAjout: faker.date.past(2),
                dateModif: faker.date.recent(),
            });

            console.log(
                `Assignation de l'image ${fileName} à l'utilisateur ID: ${i}`
            );
        }

        // Insérer les enregistrements dans la table imageUtilisateur
        await queryInterface.bulkInsert("imageUtilisateur", images, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("imageUtilisateur", null, {});
    },
};
