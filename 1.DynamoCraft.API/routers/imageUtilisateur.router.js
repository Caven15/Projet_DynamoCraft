const express = require('express');
const router = express.Router();
const imageUtilisateurController = require('../controllers/imageUtilisateur.Controller');
const upload = require("../tools/multerConfig.tools")

router.post('/imageUtilisateur/:utilisateurId', upload.single('image'), imageUtilisateurController.addImage);
router.put('/imageUtilisateur/:utilisateurId', upload.single('image'), imageUtilisateurController.updateImage);
router.delete('/imageUtilisateur/:utilisateurId', imageUtilisateurController.deleteImage);

module.exports = router;
