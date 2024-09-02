const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { faker } = require("@faker-js/faker");
const { logMessage, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } = require("../tools/logs.tools");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logMessage("Étape 6/1 : Téléchargement et assignation des images utilisateurs", COLOR_YELLOW);

        const images = [];
        const uploadDir = path.join(__dirname, "..", "uploads");

        // Sous-étape 1/3 : Vérification du répertoire 'uploads'
        logMessage("Sous-étape 1/3 : Vérification ou création du répertoire 'uploads'", COLOR_YELLOW);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
            logMessage("Répertoire 'uploads' créé avec succès", COLOR_GREEN);
        } else {
            logMessage("Répertoire 'uploads' déjà existant", COLOR_GREEN);
        }

        const imageSets = [];
        const numImageSets = 7;

        // Sous-étape 2/3 : Téléchargement des sets d'images
        logMessage("Sous-étape 2/3 : Téléchargement des images pour les différents sets", COLOR_YELLOW);
        for (let setIndex = 1; setIndex <= numImageSets; setIndex++) {
            const imageSet = [];
            const fileName = `img_set_${Date.now()}_${setIndex}.jpg`;
            const filePath = path.join(uploadDir, fileName);

            try {
                const response = await axios({
                    url: `https://picsum.photos/200/200`,
                    method: "GET",
                    responseType: "stream",
                });

                // Sauvegarder l'image téléchargée
                response.data.pipe(fs.createWriteStream(filePath));
                logMessage(`Téléchargement de l'image pour le set ${setIndex}`, COLOR_GREEN);

                imageSet.push(fileName);
            } catch (error) {
                logMessage(
                    `Erreur lors du téléchargement de l'image pour le set ${setIndex}: ${error.message}`,
                    COLOR_RED
                );
            }

            imageSets.push(imageSet);
        }

        // Sous-étape 3/3 : Assignation des images aux utilisateurs
        logMessage("Sous-étape 3/3 : Assignation des images aux utilisateurs", COLOR_YELLOW);
        for (let i = 1; i <= 300; i++) {
            const setIndex = Math.floor((i - 1) / 7) % numImageSets;
            const fileName = imageSets[setIndex][0]; // Utiliser l'image du set correspondant

            images.push({
                nom: fileName,
                utilisateurId: i,
                dateAjout: faker.date.past(2),
                dateModif: faker.date.recent(),
            });

            logMessage(`Assignation de l'image ${fileName} à l'utilisateur ID: ${i}`, COLOR_GREEN);
        }

        try {
            // Insertion dans la table imageUtilisateur
            logMessage("Insertion des images dans la table 'imageUtilisateur'", COLOR_YELLOW);
            await queryInterface.bulkInsert("imageUtilisateur", images, {});
            logMessage("Insertion des images réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de l'insertion des images : ${error.message}`, COLOR_RED);
        }
    },

    down: async (queryInterface, Sequelize) => {
        logMessage("Étape 6/2 : Suppression des images utilisateurs", COLOR_YELLOW);

        try {
            await queryInterface.bulkDelete("imageUtilisateur", null, {});
            logMessage("Suppression des images réussie", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de la suppression des images : ${error.message}`, COLOR_RED);
        }
    },
};
