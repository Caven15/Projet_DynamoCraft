const fs = require("fs");
const path = require("path");
const { faker } = require("@faker-js/faker");
const { logMessage, COLOR_GREEN, COLOR_RED, COLOR_YELLOW } = require("../tools/logs.tools");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        logMessage("Étape 10/1 : Gestion des modèles 3D", COLOR_YELLOW);

        const modelsDir = path.resolve(__dirname, "..", "seeds", "modele3d");
        const uploadsDir = path.resolve(__dirname, "..", "uploads");

        logMessage("Sous-étape 1/3 : Vérification ou création du répertoire 'uploads'", COLOR_YELLOW);
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
            logMessage(`Répertoire créé : ${uploadsDir}`, COLOR_GREEN);
        } else {
            logMessage(`Répertoire existant : ${uploadsDir}`, COLOR_GREEN);
        }

        const stlFiles = ["2_Colonnes.stl", "3DBenchy.stl", "Pikachu.stl"];
        logMessage("Sous-étape 2/3 : Vérification des fichiers STL disponibles", COLOR_YELLOW);

        const availableFiles = stlFiles.filter((file) => {
            const filePath = path.join(modelsDir, file);
            if (fs.existsSync(filePath)) {
                logMessage(`Fichier trouvé : ${filePath}`, COLOR_GREEN);
                return true;
            } else {
                logMessage(`Fichier manquant : ${filePath}`, COLOR_RED);
                return false;
            }
        });

        if (availableFiles.length === 0) {
            logMessage(`Aucun fichier STL valide trouvé dans le répertoire : ${modelsDir}`, COLOR_RED);
            return;
        }

        logMessage("Sous-étape 3/3 : Copie des fichiers STL et insertion en base de données", COLOR_YELLOW);
        const models = [];
        for (let i = 1; i <= 300; i++) {
            const numModels = faker.number.int({ min: 1, max: 3 });
            logMessage(`Projet ${i} - Nombre de modèles : ${numModels}`, COLOR_YELLOW);

            const selectedModels = faker.helpers.shuffle(availableFiles).slice(0, numModels);

            selectedModels.forEach((model) => {
                const originalPath = path.join(modelsDir, model);
                const fileName = `project_${i, Date.now()}_${model}`;
                const destPath = path.join(uploadsDir, fileName);

                try {
                    fs.copyFileSync(originalPath, destPath);
                    logMessage(`Fichier copié : ${fileName}`, COLOR_GREEN);

                    models.push({
                        nom: fileName,
                        projetId: i,
                        dateCreation: faker.date.past({ years: 2 }),
                        dateModif: faker.date.recent(),
                    });
                } catch (error) {
                    logMessage(`Erreur lors de la copie de ${fileName} : ${error.message}`, COLOR_RED);
                }
            });
        }

        if (models.length > 0) {
            try {
                await queryInterface.bulkInsert("modele3D", models, {});
                logMessage(`${models.length} modèles 3D ont été insérés dans la table modele3D.`, COLOR_GREEN);
            } catch (error) {
                logMessage(`Erreur lors de l'insertion des modèles dans la base de données : ${error.message}`, COLOR_RED);
            }
        } else {
            logMessage("Aucun modèle 3D à insérer.", COLOR_RED);
        }
    },

    down: async (queryInterface, Sequelize) => {
        logMessage("Étape 10/2 : Suppression des modèles 3D en base de données", COLOR_YELLOW);
        try {
            await queryInterface.bulkDelete("modele3D", null, {});
            logMessage("Table modele3D vidée.", COLOR_GREEN);
        } catch (error) {
            logMessage(`Erreur lors de la suppression des données : ${error.message}`, COLOR_RED);
        }
    },
};
