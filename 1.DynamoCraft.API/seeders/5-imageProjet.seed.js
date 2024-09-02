const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { faker } = require("@faker-js/faker");
const { logMessage, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } = require("../tools/logs.tools");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logMessage("Étape 8/1 : Téléchargement et insertion des images de projets", COLOR_YELLOW);

        const images = [];
        const uploadDir = path.join(__dirname, "..", "uploads");

        // Sous-étape 1/4 : Vérification du répertoire 'uploads'
        logMessage("Sous-étape 1/4 : Vérification ou création du répertoire 'uploads'", COLOR_YELLOW);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
            logMessage("Répertoire 'uploads' créé avec succès", COLOR_GREEN);
        } else {
            logMessage("Répertoire 'uploads' déjà existant", COLOR_GREEN);
        }

        const numberOfImageSets = 12;
        const imageSets = [];

        // Sous-étape 2/4 : Pré-téléchargement des jeux d'images
        logMessage("Sous-étape 2/4 : Téléchargement des sets d'images", COLOR_YELLOW);
        for (let setIndex = 0; setIndex < numberOfImageSets; setIndex++) {
            let imageSet = [];

            for (let j = 1; j <= 8; j++) {
                const fileName = `img_projet_${Date.now()}_${setIndex}_${j}.jpg`;
                const filePath = path.join(uploadDir, fileName);

                try {
                    const response = await axios({
                        url: `https://picsum.photos/200/200`,
                        method: "GET",
                        responseType: "stream",
                    });

                    response.data.pipe(fs.createWriteStream(filePath));
                    imageSet.push(fileName);
                } catch (error) {
                    logMessage(`Erreur lors du téléchargement du set #${setIndex + 1}, image #${j}`, COLOR_RED);
                }
            }

            imageSets.push(imageSet);
            logMessage(`Set d'images #${setIndex + 1} téléchargé avec succès`, COLOR_GREEN);
        }

        // Sous-étape 3/4 : Génération des images de projets
        logMessage("Sous-étape 3/4 : Attribution des images aux projets", COLOR_YELLOW);

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

            if (i % 50 === 0) {
                logMessage(`Images attribuées pour ${i}/300 projets`, COLOR_GREEN);
            }
        }

        // Sous-étape 4/4 : Insertion des images de projets en base de données
        logMessage("Sous-étape 4/4 : Insertion des images dans la base de données", COLOR_YELLOW);

        try {
            await queryInterface.bulkInsert("imageProjet", images, {});
            logMessage("Images de projets insérées avec succès", COLOR_GREEN);
        } catch (error) {
            logMessage("Erreur lors de l'insertion des images", COLOR_RED);
            console.error("Erreur lors de l'insertion des images de projets:", error);
            throw error;
        }

        logMessage("Étape 8/10 - Téléchargement et insertion des images de projets terminée", COLOR_GREEN);
    },

    down: async (queryInterface, Sequelize) => {
        logMessage("Étape 8/2 : Suppression des images de projets en base de données", COLOR_YELLOW);

        try {
            await queryInterface.bulkDelete("imageProjet", null, {});
            logMessage("Suppression des images de projets réussie", COLOR_GREEN);
        } catch (error) {
            logMessage("Erreur lors de la suppression des images de projets", COLOR_RED);
            console.error("Erreur lors de la suppression des images de projets:", error);
            throw error;
        }
    },
};
