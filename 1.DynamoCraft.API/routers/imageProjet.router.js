const express = require('express');
const router = express.Router();
const imageProjetController = require('../controllers/imageProjet.controller');
const upload = require("../tools/multerConfig.tools")

// Ajouter des images projet à un projet existant
router.post('/imageProjet/:id/projet', upload.array('images', 8), imageProjetController.create);
router.put('/imageProjet/:id/projet', upload.array('images', 8), imageProjetController.updateByProjetId);
router.get('/imagesProjet/:id/projet', imageProjetController.getAllByProjetId);
router.delete('/imageProjet/:id', imageProjetController.delete);

module.exports = router;