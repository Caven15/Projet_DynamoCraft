const express = require('express');
const router = express.Router();
const imageUtilisateurController = require('../controllers/imageUtilisateur.Controller');
const upload = require("../tools/multerConfig.tools");
const estAutorise = require('../middleware/estAutorise.middleware');

// Ajouter une image utilisateur
router.post('/imageUtilisateur', estAutorise(1), upload.single('image'), imageUtilisateurController.addImage);
router.put('/imageUtilisateur', estAutorise(1), upload.single('image'), imageUtilisateurController.updateImage);
router.delete('/imageUtilisateur', estAutorise(1), imageUtilisateurController.deleteImage);

module.exports = router;
