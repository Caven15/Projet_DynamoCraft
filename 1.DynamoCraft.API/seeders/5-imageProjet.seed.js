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

        const numberOfImageSets = 12;
        const imageSets = [];

        // Pré-télécharger les 12 jeux d'images
        for (let setIndex = 0; setIndex < numberOfImageSets; setIndex++) {
            let imageSet = [];

            for (let j = 1; j <= 8; j++) {
                const fileName = `img_projet_${Date.now()}.jpg`;
                const filePath = path.join(uploadDir, fileName);

                try {
                    const response = await axios({
                        url: `https://picsum.photos/200/200`,
                        method: "GET",
                        responseType: "stream",
                    });

                    response.data.pipe(fs.createWriteStream(filePath));
                    console.log(
                        `Téléchargement de l'image Set #${setIndex + 1}, Image #${j}`
                    );

                    imageSet.push(fileName);
                } catch (error) {
                    console.error(
                        `Erreur lors du téléchargement de l'image Set #${setIndex + 1}, Image #${j}`,
                        error.message
                    );
                }
            }

            imageSets.push(imageSet);
        }

        const percentages = {
            low: Math.floor(300 * 0.3), // 30% entre 1 et 3 images
            medium: Math.floor(300 * 0.3), // 30% entre 3 et 6 images
            high: Math.floor(300 * 0.3), // 30% entre 6 et 8 images
        };

        for (let i = 1; i <= 300; i++) {
            let numberOfImages;
            if (percentages.low > 0) {
                numberOfImages = faker.number.int({ min: 1, max: 3 });
                percentages.low--;
            } else if (percentages.medium > 0) {
                numberOfImages = faker.number.int({ min: 3, max: 6 });
                percentages.medium--;
            } else {
                numberOfImages = faker.number.int({ min: 6, max: 8 });
            }

            // Sélection aléatoire d'un set d'images
            const selectedImageSet = faker.helpers.arrayElement(imageSets);

            for (let j = 0; j < numberOfImages; j++) {
                images.push({
                    nom: selectedImageSet[j],
                    projetId: i,
                    dateCreation: faker.date.past({ years: 2 }),
                    dateModif: faker.date.recent(),
                });
            }
        }

        // Insérer les enregistrements dans la table imageProjet
        await queryInterface.bulkInsert("imageProjet", images, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("imageProjet", null, {});
    },
};
