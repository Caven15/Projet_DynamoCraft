const jwt = require("jsonwebtoken");
const {
    logMessage,
    logSQLQuery,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
} = require("../tools/logs.tools");

function estAutorise(roleRequis) {
    return (req, res, next) => {
        logMessage("Middleware 'estAutorise' appelé", COLOR_YELLOW);

        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            logMessage("Aucun token trouvé dans les en-têtes", COLOR_RED);
            return res.status(401).json({ message: "Aucun token trouvé, accès non autorisé." });
        }

        logMessage(`Token reçu : ${token}`, COLOR_GREEN);
        logMessage(`Clé secrète utilisée pour vérifier le token : ${process.env.TOKEN_SECRET}`, COLOR_YELLOW);

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                logMessage(`Erreur lors de la vérification du token : ${err.message}`, COLOR_RED);
                return res.status(403).json({ message: "Échec de la vérification du token." });
            }

            logMessage(
                `Token vérifié avec succès pour l'utilisateur : ${user.username}`,
                COLOR_GREEN
            );
            logMessage(
                `Rôle requis : ${roleRequis}, Rôle de l'utilisateur : ${user.roleId}`,
                COLOR_YELLOW
            );

            // Vérifier si le rôle de l'utilisateur est suffisant pour accéder à la route
            if (user.roleId >= roleRequis) {
                req.user = user;
                logMessage("Accès autorisé, rôle suffisant", COLOR_GREEN);
                next(); // Continuer vers la route
            } else {
                logMessage("Accès refusé, rôle insuffisant", COLOR_RED);
                return res.status(403).json({ message: "Rôle insuffisant pour accéder à cette ressource." });
            }
        });
    };
}

module.exports = estAutorise;
