const express = require('express');
const router = express.Router();
const projectController = require('../controllers/utlisateurProjetLike.controller');

router.get("/projet/:projetId/utilisateur/:utilisateurId/hasLiked", projectController.hasLiked);

module.exports = router;