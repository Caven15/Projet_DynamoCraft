const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

async function resizeImage(originalImagePath, resizedImagePath, width = 350, height = 350) {
    try {
        // Vérifie si le répertoire pour les images redimensionnées existe, sinon le crée
        const resizedDir = path.dirname(resizedImagePath);
        if (!fs.existsSync(resizedDir)) {
            fs.mkdirSync(resizedDir, { recursive: true });
        }

        // Charge l'image et redimensionne en utilisant 'cover' pour maintenir le ratio tout en remplissant les dimensions
        const image = await Jimp.read(originalImagePath);
        await image.cover(width, height).writeAsync(resizedImagePath);

        console.log(`Image redimensionnée (avec conservation du ratio) et sauvegardée dans ${resizedImagePath}`);
        return resizedImagePath;
    } catch (error) {
        console.error('Erreur lors du redimensionnement de l\'image:', error);
        throw error;
    }
}

module.exports = { resizeImage };
