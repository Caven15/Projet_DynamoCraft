const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { faker } = require("@faker-js/faker");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const downloadsDir = path.join(__dirname, "..", "uploads");

        // Créer le répertoire si nécessaire
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir, { recursive: true });
        }

        const stlFiles = [];
        const baseUrls = [
            "https://www.thingiverse.com/thing:4649050/download",
            "https://www.thingiverse.com/thing:4649051/download",
            // Ajouter d'autres URLs ici
        ];

        // Téléchargement des modèles distincts avec latence
        for (let i = 0; i < baseUrls.length; i++) {
            const fileName = `model_${i + 1}_${Date.now()}.stl`;
            const filePath = path.join(downloadsDir, fileName);

            try {
                const response = await axios({
                    url: baseUrls[i],
                    method: "GET",
                    responseType: "stream",
                });

                response.data.pipe(fs.createWriteStream(filePath));
                console.log(`Téléchargé: ${fileName}`);

                stlFiles.push(fileName);

                // Attente de 20ms avant de passer au prochain téléchargement
                await new Promise((resolve) => setTimeout(resolve, 20));
            } catch (error) {
                console.error(
                    `Erreur lors du téléchargement de ${fileName}:`,
                    error.message
                );
            }
        }

        const models = [];
        for (let i = 1; i <= 300; i++) {
            const numModels = faker.number.int({ min: 1, max: 3 });
            const selectedModels = faker.helpers
                .shuffle(stlFiles)
                .slice(0, numModels);

            selectedModels.forEach((model) => {
                models.push({
                    nom: model,
                    projetId: i,
                    dateCreation: faker.date.past({ years: 2 }),
                    dateModif: faker.date.recent(),
                });
            });
        }

        await queryInterface.bulkInsert("modele3D", models, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete("modele3D", null, {});
    },
};
