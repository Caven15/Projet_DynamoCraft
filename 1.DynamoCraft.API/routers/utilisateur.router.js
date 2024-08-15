const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateur.controller');
const upload = require("../tools/multerConfig.tools");

router.get('/utilisateurs', utilisateurController.getAll);
router.get('/utilisateur/:id', utilisateurController.getById);
router.put('/utilisateur/:id', upload.single("image"), utilisateurController.update);
router.delete('/utilisateur/:id', utilisateurController.delete);

module.exports = router;