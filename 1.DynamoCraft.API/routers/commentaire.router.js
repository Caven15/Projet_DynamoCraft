const express = require('express');
const router = express.Router();
const commentaireController = require('../controllers/commentaire.controller');
const estAutorise = require('../middleware/estAutorise.middleware');

// Route pour créer un commentaire
router.post('/comentaire', estAutorise(1), commentaireController.create);
router.get('/comentaire/:id/projet', commentaireController.getByProjectId);
router.put('/comentaire/:id', estAutorise(1), commentaireController.update);
router.delete('/comentaire/:id', estAutorise(1), commentaireController.delete);
router.get('/comentaires/utilisateur', estAutorise(1), commentaireController.getByUserId);

module.exports = router;
