const express = require('express');
const router = express.Router();
const imageUtilisateurController = require('../controllers/imageUtilisateur.Controller');
const upload = require("../tools/multerConfig.tools")

router.post('/imageUtilisateur/:id:utilisateur', upload.single('image'), imageUtilisateurController.addImage);
router.put('/imageUtilisateur/:id:utilisateur', upload.single('image'), imageUtilisateurController.updateImage);
router.delete('/imageUtilisateur/:id:utilisateur', imageUtilisateurController.deleteImage);

module.exports = router;
