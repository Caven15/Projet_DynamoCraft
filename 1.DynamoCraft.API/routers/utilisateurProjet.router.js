const express = require('express');
const router = express.Router();
const utilisateurProjet = require('../controllers/utilisateurProjet.controller');

router.get('/utilisateurProjet/:projetId/download', utilisateurProjet.downloadProjet);
router.delete('/utilisateurProjet/:utilisateurId/:projetId', utilisateurProjet.deleteUtilisateurProjet);

module.exports = router;