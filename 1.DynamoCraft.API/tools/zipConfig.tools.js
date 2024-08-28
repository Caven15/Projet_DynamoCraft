const archiver = require("archiver");
const fs = require("fs");
const path = require("path");

// Fonction pour créer une archive ZIP
const createZip = async (outputDir, projectName, files, ownerName) => {
    return new Promise((resolve, reject) => {
        // Création d'un flux d'écriture vers le fichier ZIP de sortie
        const output = fs.createWriteStream(
            path.join(outputDir, `${projectName}.zip`)
        );

        // Création d'une instance d'archiver avec le niveau de compression maximal
        const archive = archiver("zip", { zlib: { level: 9 } });

        // Événement déclenché lorsque l'archivage est terminé
        output.on("close", () => {
            resolve(output.path);
        });

        // Événement déclenché en cas d'erreur lors de l'écriture du fichier ZIP
        output.on("error", (error) => {
            reject(error); // Rejette avec l'erreur rencontrée
        });

        // Lier l'archive à la sortie
        archive.pipe(output);

        // Ajouter chaque fichier à l'archive ZIP
        files.forEach((filePath) => {
            const fileExtension = path.extname(filePath).toLowerCase();
            const fileName = path.basename(filePath);
            let folderName = "";

            console.log(fileExtension);

            // Déterminer le dossier de destination en fonction de l'extension du fichier
            if ([".jpg", ".jpeg", ".png"].includes(fileExtension)) {
                folderName = "img";
            } else if ([".obj", ".fbx", ".stl"].includes(fileExtension)) {
                folderName = "models";
            }

            // Ajouter le fichier au sous-dossier approprié
            if (folderName) {
                archive.append(fs.createReadStream(filePath), {
                    name: path.join(folderName, fileName),
                });
            } else {
                // Si l'extension n'est pas reconnue, ajouter le fichier à la racine de l'archive
                archive.append(fs.createReadStream(filePath), {
                    name: fileName,
                });
            }
        });

        // Contenu du fichier texte
        const readmeContent = `
        █▀▄ █▄█ █▄ █ ▄▀█ █▀▄▀█ █▀█ █▀▀ █▀█ ▄▀█ █▀▀ ▀█▀
        █▄▀  █  █ ▀█ █▀█ █ ▀ █ █▄█ █▄▄ █▀▄ █▀█ █▀   █ 

        Projet: ${projectName}
        Propriétaire: ${ownerName}

        Nous espérons que vous apprécierez ce projet et que vous trouverez ce contenu utile.

        Bon amusement!

        L'équipe DynamoCraft.`;

        // Ajouter le fichier texte "README.txt" à la racine de l'archive
        archive.append(readmeContent, { name: "README.txt" });

        // Finaliser l'archive
        archive.finalize();
    });
};

// Fonction pour récupérer les noms de fichiers associés à un projet
const getProjectFileNames = (project) => {
    const imageFileNames = project.imageProjet
        ? Array.isArray(project.imageProjet)
            ? project.imageProjet.map((file) => file.nom)
            : [project.imageProjet.nom]
        : [];
    const modele3DFileNames = project.Modele3D
        ? Array.isArray(project.Modele3D)
            ? project.Modele3D.map((file) => file.nom)
            : [project.Modele3D.nom]
        : [];
    return [...imageFileNames, ...modele3DFileNames];
};

module.exports = {
    createZip,
    getProjectFileNames,
};
