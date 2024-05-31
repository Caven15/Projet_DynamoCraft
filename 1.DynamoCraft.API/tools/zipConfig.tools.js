const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// Fonction pour créer une archive ZIP
const createZip = async (outputDir, projectName, files) => {
    return new Promise((resolve, reject) => {
        // Création d'un flux d'écriture vers le fichier ZIP de sortie
        const output = fs.createWriteStream(path.join(outputDir, `${projectName}.zip`));
        
        // Création d'une instance d'archiver avec le niveau de compression maximal
        const archive = archiver('zip', { zlib: { level: 9 } });

        // Événement déclenché lorsque l'archivage est terminé
        output.on('close', () => {
            resolve(output.path); // Résout avec le chemin du fichier ZIP créé
        });

        // Événement déclenché en cas d'erreur lors de l'écriture du fichier ZIP
        output.on('error', (error) => {
            reject(error); // Rejette avec l'erreur rencontrée
        });

        // Lier l'archive à la sortie
        archive.pipe(output);

        // Ajouter chaque fichier à l'archive ZIP
        files.forEach(filePath => {
            const fileExtension = path.extname(filePath).toLowerCase();
            const fileName = path.basename(filePath);
            let folderName = '';

            // Déterminer le dossier de destination en fonction de l'extension du fichier
            if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png') {
                folderName = 'img';
            } else if (fileExtension === '.obj' || fileExtension === '.fbx' || fileExtension === '.stl') {
                folderName = 'models';
            }

            // Ajouter le fichier au sous-dossier approprié
            if (folderName) {
                archive.append(fs.createReadStream(filePath), { name: path.join(folderName, fileName) });
            } else {
                // Si l'extension n'est pas reconnue, ajouter le fichier à la racine de l'archive
                archive.append(fs.createReadStream(filePath), { name: fileName });
            }
        });

        // Ajouter le fichier texte "hello.txt" à la racine de l'archive
        archive.append('Test pour voir si le fichier est bien lisible', { name: 'README.txt' });

        // Finaliser l'archive
        archive.finalize();
    });
};

module.exports = {
    createZip
};
