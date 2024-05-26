const express = require("express");
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

// Import des différents routeurs avec leurs endpoints...
const authRouter = require("./routers/auth.router");
const utilisateurRouter = require("./routers/utilisateur.router");
app.use("/api", authRouter);
app.use("/api", utilisateurRouter);
app.use(express.urlencoded({ extended: true }));

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
