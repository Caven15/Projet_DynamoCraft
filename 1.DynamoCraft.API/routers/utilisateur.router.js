const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateur.controller');
const upload = require("../tools/multerConfig.tools")

// Récupérer tous les utilisateurs
router.get('/utilisateurs', utilisateurController.getAll);

// Récupérer un utilisateur par ID
router.get('/utilisateur/:id', utilisateurController.getById);

// Mettre à jour un utilisateur par ID
router.put('/utilisateur/:id', upload.single("image"), utilisateurController.update);

// Supprimer un utilisateur par ID
router.delete('/utilisateur/:id', utilisateurController.delete);

module.exports = router;
