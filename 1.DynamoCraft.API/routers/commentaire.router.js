// routes/commentaire.js
const express = require('express');
const router = express.Router();
const commentaireController = require('../controllers/commentaire.controller');

// Route pour créer un commentaire
router.post('/comentaire/:id/utilisateur', commentaireController.create);
router.get('/comentaire/:id/projet', commentaireController.getByProjectId);
router.put('/comentaire/:id', commentaireController.update);
router.delete('/comentaire/:id', commentaireController.delete);
router.get('/comentaires/:id/utilisateur', commentaireController.getByUserId);

module.exports = router;
