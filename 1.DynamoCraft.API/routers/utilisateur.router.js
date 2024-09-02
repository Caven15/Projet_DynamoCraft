const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateur.controller');
const upload = require("../tools/multerConfig.tools");
const estAutorise = require("../middleware/estAutorise.middleware");

router.get('/utilisateurs', estAutorise(2),  utilisateurController.getAll);
router.get('/utilisateur/:id', utilisateurController.getById);
router.put('/utilisateur/:id', estAutorise(1), upload.single("image"), utilisateurController.update);
router.delete('/utilisateur/:id', estAutorise(1), utilisateurController.delete);
router.put('/utilisateur/:id/toggle-activation', estAutorise(2), utilisateurController.toggleActivation);

module.exports = router;
