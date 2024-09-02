const express = require('express');
const router = express.Router();
const imageProjetController = require('../controllers/imageProjet.controller');
const upload = require("../tools/multerConfig.tools");
const estAutorise = require('../middleware/estAutorise.middleware');

// Ajouter des images projet à un projet existant
router.post('/imageProjet/:id/projet', estAutorise(1), upload.array('images', 8), imageProjetController.create);
router.put('/imageProjet/:id/projet', estAutorise(1), upload.array('images', 8), imageProjetController.updateByProjetId);
router.get('/imagesProjet/:id/projet', estAutorise(1), imageProjetController.getAllByProjetId);
router.delete('/imageProjet/:id', estAutorise(1), imageProjetController.delete);

module.exports = router;
