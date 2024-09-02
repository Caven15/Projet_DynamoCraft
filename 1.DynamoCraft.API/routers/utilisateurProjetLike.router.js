const express = require('express');
const router = express.Router();
const utilisateurProjetLikeController = require('../controllers/utlisateurProjetLike.controller');
const estAutorise = require("../middleware/estAutorise.middleware");

router.get("/projet/:projetId/hasLiked", estAutorise(1), utilisateurProjetLikeController.hasLiked);

module.exports = router;
