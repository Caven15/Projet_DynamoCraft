const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const db = require("./tools/ConnexionDb.tools");
const upload = require("./tools/multerConfig.tools"); // Assurez-vous d'importer multerConfig

// Connexion à la base de données
db.connect();

// Middleware pour traiter les données JSON avec une taille maximale augmentée
app.use(express.json({ limit: '10mb' })); // Augmentez la limite selon vos besoins

// Middleware pour traiter les données de formulaire
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Augmentez la limite selon vos besoins

// Configuration du middleware CORS pour autoriser uniquement le domaine spécifié (local pour le moment)
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200, // Certains navigateurs nécessitent cette option pour la gestion des CORS
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization"
};

// Activation du middleware CORS
app.use(cors(corsOptions));

// Middleware permettant la définition des en-têtes CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// Activation du middleware CORS

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
    res.write(JSON.stringify(message));
    res.end();
});

// Démarrage du serveur et affichage du message
app.listen(port, console.clear(), () => {
    const message = `Serveur local en ligne sur le port : ${port} ✅`;
    console.log(message);
});