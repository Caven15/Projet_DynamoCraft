const express = require('express');
const router = express.Router();
const utilisateurProjet = require('../controllers/utilisateurProjet.controller');
const estAutorise = require("../middleware/estAutorise.middleware");

router.get('/utilisateurProjet/:projetId/download', estAutorise(1), utilisateurProjet.downloadProjet);
router.delete('/utilisateurProjet/:projetId', estAutorise(1), utilisateurProjet.deleteUtilisateurProjet);

module.exports = router;
