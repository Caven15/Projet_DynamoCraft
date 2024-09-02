const dbConnector = require("../tools/ConnexionDb.tools").get();
const {
    logMessage,
    COLOR_RED,
    COLOR_YELLOW,
    COLOR_GREEN,
} = require("../tools/logs.tools");
const jwt = require("jsonwebtoken");

// Vérifier si un utilisateur a déjà liké un projet
exports.hasLiked = async (req, res, next) => {
    try {
        const { projetId } = req.params;

        // Extraire l'utilisateur du token JWT
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const utilisateurId = decodedToken.id;

        // Log pour début de la vérification
        logMessage(
            `Vérification du like pour utilisateurId: ${utilisateurId} et projetId: ${projetId}`,
            COLOR_YELLOW
        );

        if (!dbConnector.UtilisateurProjetLike) {
            logMessage(
                "Le modèle UtilisateurProjetLike n'est pas défini dans dbConnector",
                COLOR_RED
            );
            throw new Error(
                "Le modèle UtilisateurProjetLike n'est pas accessible."
            );
        } else {
            logMessage(
                "Le modèle UtilisateurProjetLike est chargé avec succès",
                COLOR_GREEN
            );
        }

        const like = await dbConnector.UtilisateurProjetLike.findOne({
            where: {
                utilisateurId: utilisateurId,
                projetId: projetId,
            },
        });

        // Vérification du like
        if (like) {
            logMessage(
                `L'utilisateur ${utilisateurId} a déjà liké le projet ${projetId}`,
                COLOR_YELLOW
            );
            return res.status(200).json({ hasLiked: true });
        } else {
            logMessage(
                `L'utilisateur ${utilisateurId} n'a pas encore liké le projet ${projetId}`,
                COLOR_YELLOW
            );
            return res.status(200).json({ hasLiked: false });
        }
    } catch (error) {
        logMessage(
            `Erreur lors de la vérification du like : ${error.message}`,
            COLOR_RED
        );
        return res
            .status(500)
            .json({ message: "Erreur lors de la vérification du like." });
    }
};
