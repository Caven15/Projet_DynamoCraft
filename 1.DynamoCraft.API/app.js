const express = require("express");
const path = require('path');
const fs = require('fs');
const { resizeImage } = require('./tools/imageResize.tools'); // Importer l'outil de redimensionnement
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const db = require("./tools/ConnexionDb.tools");

// Connexion à la base de données
db.connect();

// Middleware pour traiter les données JSON
app.use(express.json());

// Middleware pour traiter les données de formulaire
app.use(express.urlencoded({ extended: true }));

// Configuration du middleware CORS pour autoriser uniquement le domaine spécifié (local pour le moment)
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // Certains navigateurs nécessitent cette option pour la gestion des CORS
};

// Middleware permettant la définition des en-têtes CORS
app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

// Activation du middleware CORS
app.use(cors());

// Servir les fichiers statiques avec redimensionnement automatique
app.get('/uploads/:filename', async (req, res) => {
    const fileName = req.params.filename;
    const originalImagePath = path.join(__dirname, 'uploads', fileName);
    const resizedImagePath = path.join(__dirname, 'uploads', 'resized', fileName);

    // Vérifiez si l'image d'origine existe
    if (!fs.existsSync(originalImagePath)) {
        return res.status(404).send('Image non trouvée');
    }

    // Si l'image redimensionnée existe déjà, renvoyez-la
    if (fs.existsSync(resizedImagePath)) {
        return res.sendFile(resizedImagePath);
    }

    try {
        // Utiliser l'outil de redimensionnement
        const resizedImage = await resizeImage(originalImagePath, resizedImagePath);
        return res.sendFile(resizedImage);
    } catch (error) {
        return res.status(500).send('Erreur lors du traitement de l\'image.');
    }
});

// Import des différents routeurs avec leurs endpoints...
const routers = [
    require("./routers/auth.router"),
    require("./routers/utilisateur.router"),
    require("./routers/statistique.router"),
    require("./routers/categorie.router"),
    require("./routers/imageUtilisateur.router"),
    require("./routers/projet.router"),
    require("./routers/commentaire.router"),
    require("./routers/imageProjet.router"),
    require("./routers/modele3D.router"),
    require("./routers/utilisateurProjet.router")
];

// Utilisation des routeurs
routers.forEach(router => {
    app.use("/api", router);
});

// Gestion de la requête pour les routes non définies
app.all("*", (req, res) => {
    const message = `La requête ${req.url} ne correspond à aucune route connue... ⚠️`;
    console.log(message);
    res.status(404).send(message);
});

// Démarrage du serveur et affichage du message
app.listen(port, () => {
    console.clear();
    const message = `Serveur local en ligne sur le port : ${port} ✅`;
    console.log(message);
});
