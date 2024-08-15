const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');

async function resizeImage(originalImagePath, resizedImagePath, width = 350, height = 350) {
    try {
        // Je vérifie si le répertoire de sortie existe, et si ce n'est pas le cas, je le crée.
        const resizedDir = path.dirname(resizedImagePath);
        if (!fs.existsSync(resizedDir)) {
            fs.mkdirSync(resizedDir, { recursive: true });
        }

        // Je lis l'image originale à partir du chemin donné.
        const image = await Jimp.read(originalImagePath);
        
        // Je redimensionne l'image en utilisant `cover`, ce qui garantit que l'image
        // remplira les dimensions spécifiées (width x height) sans bordures,
        // mais certaines parties de l'image seront peut-être coupées.
        await image.cover(width, height).writeAsync(resizedImagePath);

        // Je retourne le chemin de l'image redimensionnée une fois que l'opération est terminée.
        console.log(`Image redimensionnée sans bordures : ${resizedImagePath}`);
        return resizedImagePath;
    } catch (error) {
        // En cas d'erreur, j'affiche le message d'erreur dans la console et le propage.
        console.error('Erreur lors du redimensionnement de l\'image:', error);
        throw error;
    }
}

module.exports = { resizeImage };
