// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projet.controller');

// Créer un projet
router.post('/projet', projetController.create);
router.get('/projets', projetController.getAll);
router.get('/projet/:id', projetController.getById);
router.get('/projet/:utilisateurid', projetController.getByUserId);
router.put('/projet/:id', projetController.updateById);
router.delete('/projet/:id', projetController.delete);
router.get('/projet/:id/download', projetController.download);
router.get('/projet/:id/categorie', projetController.getByCategoryId);

router.get('/projets/valide', projetController.getValidProjet);
router.get('/projets/invalide', projetController.getInvalidProjet);
router.get('/projets/enAttente', projetController.getPendingProjet);

router.put('/projet/:id/valide', projetController.setValidProjet);
router.put('/projet/:id/invalide', projetController.setInvalidProjet);
router.put('/projet/:id/enAttente', projetController.setPendingProjet);

module.exports = router;