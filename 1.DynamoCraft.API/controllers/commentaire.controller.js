const dbConnector = require("../tools/ConnexionDb.tools").get();

// Créer un commentaire
exports.create = async (req, res, next) => {
    try {
        const { description, projetId } = req.body;
        const { id } = req.params; // id from URL params

        if (!description || !projetId) {
            return res.status(400).json({ message: 'La description et le projet sont obligatoires' });
        }

        // Vérifier si le projet existe
        const utilisateur = await dbConnector.Utilisateur.findByPk(id);
        if (!utilisateur) {
            return res.status(404).json({ message: 'L\'tilisateur n\'existe pas' });
        }

        // Vérifier si le projet existe
        const projet = await dbConnector.Projet.findByPk(projetId);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Créer le commentaire
        const newCommentaire = await dbConnector.Commentaire.create({
            description,
            dateCreation: new Date(),
            dateModif: new Date(),
            projetId,
            utilisateurId : utilisateur.id
        });

        res.status(201).json({ message: 'Commentaire créé avec succès', commentaire: newCommentaire });
    } catch (error) {
        console.error('Erreur lors de la création du commentaire :', error);
        res.status(500).json({ message: 'Erreur lors de la création du commentaire' });
    }
};

// Récupérer tous les commentaires par projetID
exports.getByProjectId = async (req, res, next) => {
    try {
        const id = req.params.id;

        // Vérifier si le projet existe
        const projet = await dbConnector.Projet.findByPk(id);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Récupérer les commentaires associés au projet
        const commentaires = await dbConnector.Commentaire.findAll({
            where: { projetId: id },
            include: [
                { model: dbConnector.Projet }
            ]
        });

        res.status(200).json({ commentaires });
    } catch (error) {
        console.error('Erreur lors de la récupération des commentaires par projetID :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des commentaires par projetID' });
    }
};

// Mettre à jour un commentaire par ID
exports.update = async (req, res, next) => {
    try {
        const { description, utilisateurId } = req.body;
        const commentaireId = req.params.id;

        // Vérifier si le commentaire existe
        const commentaire = await dbConnector.Commentaire.findByPk(commentaireId);
        if (!commentaire) {
            return res.status(404).json({ message: 'Commentaire non trouvé' });
        }

        // Vérifier si l'utilisateur est le titulaire du commentaire
        if (commentaire.utilisateurId !== utilisateurId) {
            return res.status(403).json({ message: "Vous n'êtes pas autorisé à mettre à jour ce commentaire" });
        }

        // Mettre à jour le commentaire
        await commentaire.update({ 
            description,
            dateModif : new Date()
        });

        res.status(200).json({ message: `Commentaire ${commentaireId} mis à jour avec succès !` });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du commentaire :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du commentaire' });
    }
};

// Supprimer un commentaire par ID
exports.delete = async (req, res, next) => {
    try {
        const commentaireId = req.params.id;

        // Vérifier si le commentaire existe
        const commentaire = await dbConnector.Commentaire.findByPk(commentaireId);
        if (!commentaire) {
            return res.status(404).json({ message: 'Commentaire non trouvé' });
        }

        // Supprimer le commentaire
        await commentaire.destroy();

        res.status(200).json({ message: `Commentaire ${commentaireId} supprimé avec succès !` });
    } catch (error) {
        console.error('Erreur lors de la suppression du commentaire :', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du commentaire' });
    }
};
