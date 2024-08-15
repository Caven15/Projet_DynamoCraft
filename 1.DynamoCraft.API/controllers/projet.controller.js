const dbConnector = require("../tools/ConnexionDb.tools").get();
const { Op } = require('sequelize');


exports.create = async (req, res, next) => {
    try {
        const { nom, description, categorieId, utilisateurId } = req.body;
        const { files } = req;

        if (!nom || !categorieId || !description || !utilisateurId) {
            return res.status(400).json({ message: 'Le nom, la description, la catégorie et l\'utilisateur sont obligatoires' });
        }

        // Vérifier si l'utilisateur existe
        const utilisateur = await dbConnector.Utilisateur.findByPk(utilisateurId);
        if (!utilisateur) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Vérifier le nombre total d'images de projet
        const existingImagesCount = await dbConnector.ImageProjet.count();
        if (existingImagesCount + (files ? files.length : 0) > 8) {
            return res.status(400).json({ message: 'Limite de 8 images par projet atteinte' });
        }

        // Créer une nouvelle statistique
        const newStat = await dbConnector.Statistique.create({
            nombreApreciation: 0,
            nombreTelechargement: 0,
            datePublication: new Date(),
            dateModification: new Date()
        });

        // Créer le projet avec la référence de la statistique
        const newProjet = await dbConnector.Projet.create({
            nom,
            description,
            estvalide: false,
            commentaire_admin: "En attente de validation.",
            statutId: 3, 
            statistiqueId: newStat.id,
            categorieId,
            utilisateurId,
        });

        // Ajouter les images de projet, si des fichiers sont joints
        if (files && files.length > 0) {
            const images = [];
            for (const file of files) {
                const newImageProjet = await dbConnector.ImageProjet.create({
                    nom: file.filename,
                    dateCreation: new Date(),
                    dateModif: new Date(),
                    projetId: newProjet.id
                });
                images.push(newImageProjet);
            }
            res.status(201).json({ message: 'Projet créé avec succès', projet: newProjet, images });
        } else {
            res.status(201).json({ message: 'Projet créé avec succès', projet: newProjet });
        }

    } catch (error) {
        console.error('Erreur lors de la création du projet :', error);
        res.status(500).json({ message: 'Erreur lors de la création du projet' });
    }
};

// Récupérer tous les projets
exports.getAll = async (req, res, next) => {
    try {
        const projects = await dbConnector.Projet.findAll({
            include: [
                { model: dbConnector.Statut, attributes: { exclude: ['id'] } },
                { model: dbConnector.Statistique, attributes: { exclude: ['id'] } },
                { model: dbConnector.Categorie, attributes: { exclude: ['id'] } },
                { model: dbConnector.Utilisateur, attributes: { exclude: ['roleId'] } },
                { 
                    model: dbConnector.Utilisateur,
                    attributes: { exclude: ['id', 'password'] } 
                }
            ],
            attributes: { exclude: ['statutId', 'statistiqueId', 'categorieId', 'utilisateurId'] } // Exclure les champs redondants
        });

        res.status(200).json({ projects });
    } catch (error) {
        console.error('Erreur lors de la récupération des projets :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des projets' });
    }
};

// Récupérer un projet par ID
exports.getById = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        // Récupérer le projet avec son ID
        const project = await dbConnector.Projet.findByPk(projectId, {
            include: [
                { model: dbConnector.Statut },
                { model: dbConnector.Statistique },
                { model: dbConnector.Categorie },
                { model: dbConnector.Utilisateur, attributes: { exclude: ['roleId'] } },
                { 
                    model: dbConnector.Utilisateur,
                    attributes: { exclude: ['password'] } // Exclure le mot de passe de l'utilisateur
                }
            ],
            attributes: { exclude: ['statutId', 'statistiqueId', 'categorieId', 'utilisateurId'] } // Exclure les champs redondants
        });

        if (!project) {
            console.log("test");
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        res.status(200).json({ project });
    } catch (error) {
        console.error('Erreur lors de la récupération du projet :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération du projet' });
    }
};

// Récupérer les projets par utilisateurId
exports.getByUserId = async (req, res, next) => {
    try {
        const userId = req.params.id; // Récupérer l'ID de l'utilisateur à partir des paramètres de la requête

        // Récupérer les projets associés à l'utilisateur
        const projects = await dbConnector.Projet.findAll({
            where: {
                utilisateurId: userId // Filtrer les projets par utilisateurId
            },
            include: [
                { model: dbConnector.Statut },
                { model: dbConnector.Statistique },
                { model: dbConnector.Categorie },
                { model: dbConnector.Utilisateur, attributes: { exclude: ['roleId'] } },
                { 
                    model: dbConnector.Utilisateur,
                    attributes: { exclude: ['password'] } // Exclure le mot de passe de l'utilisateur
                }
            ],
            attributes: { exclude: ['statutId', 'statistiqueId', 'categorieId', 'utilisateurId'] } // Exclure les champs redondants
        });

        res.status(200).json({ projects });
    } catch (error) {
        console.error('Erreur lors de la récupération des projets par utilisateurId :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des projets par utilisateurId' });
    }
};

// Mettre à jour un projet par ID
exports.updateById = async (req, res, next) => {
    try {
        const { nom, description, categorieId } = req.body;
        const projectId = req.params.id;
        console.log(projectId);

        // Vérifier si le projet existe
        const projet = await dbConnector.Projet.findByPk(projectId);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Mettre à jour les attributs du projet
        await projet.update({
            nom,
            description,
            categorieId
        });

        res.status(200).json({ message: `Projet ${projectId} mis à jour avec succès !` });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du projet :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du projet' });
    }
};

// Supprimer un projet par ID
exports.delete = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        // Vérifier si le projet existe
        const projet = await dbConnector.Projet.findByPk(projectId);
        if (!projet) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Supprimer les relations associées (Images, Commentaires, Modèles 3D, Statistiques)
        await dbConnector.ImageProjet.destroy({
            where: { projetId: projectId }
        });

        await dbConnector.Commentaire.destroy({
            where: { projetId: projectId }
        });

        await dbConnector.Modele3D.destroy({
            where: { projetId: projectId }
        });

        await projet.destroy();

        await dbConnector.Statistique.destroy({
            where: { id: projet.statistiqueId }
        });

        res.status(200).json({ message: `Projet ${projectId} supprimé avec succès !` });
    } catch (error) {
        console.error('Erreur lors de la suppression du projet :', error);
        res.status(500).json({ message: 'Erreur lors de la suppression du projet' });
    }
};

// Télécharger un projet
exports.download = async (req, res, next) => {
    console.log("manque controller image pour fonctionner correctement...");
    return res.status(201).json({ message: 'manque modèle 3 et image pour fonctionner correctement...' });
};

// Récupérer tous les projets par catégorie
exports.getByCategoryId = async (req, res, next) => {
    try {
        const categoryId = req.params.id;

        // Vérifier si la catégorie existe
        const categorie = await dbConnector.Categorie.findByPk(categoryId);
        if (!categorie) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }

        // Récupérer les projets associés à la catégorie
        const projects = await dbConnector.Projet.findAll({
            where: { categorieId: categoryId },
            include: [
                { model: dbConnector.Statut, attributes: { exclude: ['id'] } },
                { model: dbConnector.Statistique, attributes: { exclude: ['id'] } },
                { model: dbConnector.Categorie, attributes: { exclude: ['id'] } },
                { 
                    model: dbConnector.Utilisateur,
                    attributes: { exclude: ['id', 'password'] } 
                }
            ]
        });

        res.status(200).json({ projects });
    } catch (error) {
        console.error('Erreur lors de la récupération des projets par catégorie :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des projets par catégorie' });
    }
};

// Récupérer tous les projets valides
exports.getValidProjet = async (req, res, next) => {
    try {
        // Récupérer les projets avec le statut "valide"
        const projects = await dbConnector.Projet.findAll({
            where: { estvalide: true },
            include: [
                { model: dbConnector.Statut, attributes: { exclude: ['id'] } },
                { model: dbConnector.Statistique, attributes: { exclude: ['id'] } },
                { model: dbConnector.Categorie, attributes: { exclude: ['id'] } },
                { 
                    model: dbConnector.Utilisateur,
                    attributes: { exclude: ['id', 'password'] } 
                }
            ]
        });

        res.status(200).json({ projects });
    } catch (error) {
        console.error('Erreur lors de la récupération des projets valides :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des projets valides' });
    }
};

// Récupérer tous les projets invalides
exports.getInvalidProjet = async (req, res, next) => {
    try {
        // Récupérer les projets avec le statut "invalide"
        const projects = await dbConnector.Projet.findAll({
            where: {  statutId: 2 },
            include: [
                { model: dbConnector.Statut, attributes: { exclude: ['id'] } },
                { model: dbConnector.Statistique, attributes: { exclude: ['id'] } },
                { model: dbConnector.Categorie, attributes: { exclude: ['id'] } },
                { 
                    model: dbConnector.Utilisateur,
                    attributes: { exclude: ['id', 'password'] } 
                }
            ]
        });

        res.status(200).json({ projects });
    } catch (error) {
        console.error('Erreur lors de la récupération des projets invalides :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des projets invalides' });
    }
};

// Récupérer tous les projets en attente
exports.getPendingProjet = async (req, res, next) => {
    try {
        // Récupérer les projets avec le statut "en attente"
        const projects = await dbConnector.Projet.findAll({
            where: { statutId: 3 }, // Supposant que le statut "en attente" a l'ID 3
            include: [
                { model: dbConnector.Statut, attributes: { exclude: ['id'] } },
                { model: dbConnector.Statistique, attributes: { exclude: ['id'] } },
                { model: dbConnector.Categorie, attributes: { exclude: ['id'] } },
                { 
                    model: dbConnector.Utilisateur,
                    attributes: { exclude: ['id', 'password'] } 
                }
            ]
        });

        res.status(200).json({ projects });
    } catch (error) {
        console.error('Erreur lors de la récupération des projets en attente :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des projets en attente' });
    }
};

// Mettre à jour l'état d'un projet en "valide"
exports.setValidProjet = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await dbConnector.Projet.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        await project.update({ estvalide: true, statutId: 1 }); // Supposons que statutId 1 correspond à "valide"
        res.status(200).json({ message: `Le projet ${projectId} a été mis à jour en "valide".` });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du projet en valide :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du projet en valide.' });
    }
};

// Mettre à jour l'état d'un projet en "invalide"
exports.setInvalidProjet = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await dbConnector.Projet.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        await project.update({ estvalide: false, statutId: 2 }); // Supposons que statutId 2 correspond à "invalide"
        res.status(200).json({ message: `Le projet ${projectId} a été mis à jour en "invalide".` });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du projet en invalide :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du projet en invalide.' });
    }
};

// Mettre à jour l'état d'un projet en "en attente"
exports.setPendingProjet = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await dbConnector.Projet.findByPk(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        await project.update({ estvalide: false, statutId: 3 }); // Supposons que statutId 3 correspond à "en attente"
        res.status(200).json({ message: `Le projet ${projectId} a été mis à jour en "en attente".` });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du projet en attente :', error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du projet en attente.' });
    }
};

// Incrémenter le nombre de likes pour un projet spécifique
exports.incrementLike = async (req, res, next) => {
    try {
        const projectId = req.params.id;

        // Vérifier si le projet existe
        const project = await dbConnector.Projet.findByPk(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }

        // Incrémenter le nombre de likes dans la statistique associée au projet
        await dbConnector.Statistique.increment('nombreApreciation', { where: { id: project.statistiqueId } });

        res.status(200).json({ message: 'Nombre de likes incrémenté avec succès pour le projet ' + projectId });
    } catch (error) {
        console.error('Erreur lors de l\'incrémentation du nombre de likes pour le projet :', error);
        res.status(500).json({ message: 'Erreur lors de l\'incrémentation du nombre de likes pour le projet' });
    }
};

// Récupérer les 10 projets les plus likés
exports.getTop10Liked = async (req, res, next) => {
    try {
        const topProjects = await dbConnector.Projet.findAll({
            where: {
                '$Statut.nom$': 'Validé' // Condition pour inclure uniquement les projets validés
            },
            include: [
                {
                    model: dbConnector.Statistique,
                    attributes: ['nombreApreciation'], // Inclure uniquement l'attribut nombreApreciation
                },
                {
                    model: dbConnector.Statut,
                    attributes: ['nom'] // Inclure uniquement l'attribut nom
                },
                {
                    model: dbConnector.Categorie,
                    attributes: ['nom'] // Inclure uniquement l'attribut nom
                },
                {
                    model: dbConnector.Utilisateur,
                    attributes: ['pseudo'] // Inclure uniquement l'attribut nom
                }
            ],
            attributes: {
                exclude: ['statutId', 'statistiqueId', 'categorieId', 'utilisateurId']
            },
            order: [[{ model: dbConnector.Statistique }, 'nombreApreciation', 'DESC']], // Ordonner par le nombre d'appréciations décroissant
            limit: 10
        });

        res.status(200).json(topProjects);
    } catch (error) {
        console.error('Erreur lors de la récupération des 10 projets les plus likés :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des 10 projets les plus likés' });
    }
};

// Récupérer les 16 derniers projets créés
exports.getLast = async (req, res, next) => {
    try {
        const recentProjects = await dbConnector.Projet.findAll({
            include: [
                {
                    model: dbConnector.Statut,
                    attributes: { exclude: ['id'] }
                },
                {
                    model: dbConnector.Statistique,
                    attributes: { exclude: ['id'] }
                },
                {
                    model: dbConnector.Categorie,
                    attributes: { exclude: ['id'] }
                },
                {
                    model: dbConnector.Utilisateur,
                    attributes: { exclude: ['roleId', 'password'] }
                },
                {
                    model: dbConnector.ImageProjet,
                    attributes: { exclude: ["projetId"] }, // Exclude foreign key if not needed
                },
            ],
            where: {
                estvalide: true // Filtre pour les projets valides seulement
            },
            attributes: { exclude: ['statutId', 'statistiqueId', 'categorieId', 'utilisateurId'] },
            order: [[dbConnector.Statistique, 'datePublication', 'DESC']],
            limit: 16
        });

        res.status(200).json({ recentProjects });
    } catch (error) {
        console.error('Erreur lors de la récupération des derniers projets créés :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des derniers projets créés' });
    }
};

// Recherche de projet par mo clés => Propriétaire, catégorie, titre ou description liés au projet avec pagination pour gestion de grand ensembles
exports.search = async (req, res, next) => {
    try {
        const { keyword, page = 1, limit = 10 } = req.params;

        if (!keyword) {
            return res.status(400).json({ message: 'Le mot-clé de recherche est obligatoire' });
        }

        const offset = (page - 1) * limit;

        const { count, rows } = await dbConnector.Projet.findAndCountAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            { nom: { [Op.like]: `%${keyword}%` } },
                            { description: { [Op.like]: `%${keyword}%` } },
                            { '$Categorie.nom$': { [Op.like]: `%${keyword}%` } },
                            { '$Utilisateur.pseudo$': { [Op.like]: `%${keyword}%` } }
                        ]
                    },
                    { '$Statut.nom$': 'Validé' } // Condition pour inclure uniquement les projets validés
                ]
            },
            include: [
                { model: dbConnector.Statut, attributes: { exclude: ['id'] } },
                { model: dbConnector.Statistique, attributes: { exclude: ['id'] } },
                { model: dbConnector.Categorie, attributes: { exclude: ['id'] } },
                { model: dbConnector.Utilisateur, attributes: { exclude: ['roleId', 'password'] } }
            ],
            attributes: { exclude: ['statutId', 'statistiqueId', 'categorieId', 'utilisateurId'] },
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            projects: rows
        });
    } catch (error) {
        console.error('Erreur lors de la recherche des projets :', error);
        res.status(500).json({ message: 'Erreur lors de la recherche des projets' });
    }
};