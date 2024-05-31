const express = require('express');
const router = express.Router();
const utilisateurProjet = require('../controllers/utilisateurProjet.controller');

// Route pour télécharger les fichiers associés à un projet sous forme d'une archive ZIP
router.get('/utilisateurProjet/:projetId/download', utilisateurProjet.downloadProjet);

module.exports = router;