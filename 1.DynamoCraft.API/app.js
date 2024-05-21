const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const cors = require("cors")
const db = require("./tools/ConnexionDb.tools")

db.connect()
app.use(express.json())
app.use(express.urlencoded({extended : true}))

// Configuration du middleware cors pour autoriser uniquement le domaine spécifé (local pour le moment)
const corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200 // Certains navigateurs nécessitent cette option pour la gestion des cors
};


// Middleware permettant la définition des en-têtes cors 
app.use(function(req,res,next){
    res.header(
        "Acces-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    )
    next();
})

app.use(cors());

// Imports des différents routeurs avec leurs endpoints...
const authRouter = require("./routers/auth.router")
app.use("/auth", authRouter)

// si aucune route ne conrrespond a la recherche...
app.all("*", (req,res) => {
    console.log(`La requete ${req.url} ne correspond a aucune route connue...`);
    res.write(JSON.stringify(`La requete ${req.url} ne correspond a aucune route connue...`));
    res.end()
})

app.listen(port, console.log(`Serveur en ligne sur le port: ${port}`))