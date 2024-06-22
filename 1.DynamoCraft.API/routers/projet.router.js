// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projet.controller');
const upload = require("../tools/multerConfig.tools")

router.post('/projet', upload.array('images', 8), projetController.create);
router.get('/projets', projetController.getAll);
router.get('/projet/top', projetController.getTop10Liked); 
router.get('/projet/last', projetController.getLast);
router.get('/projet/:id', projetController.getById);
router.get('/projet/:id/utilisateur', projetController.getByUserId);
router.put('/projet/:id', projetController.updateById);
router.delete('/projet/:id', projetController.delete);
router.get('/projet/:id/download', projetController.download);
router.get('/projet/:id/categorie', projetController.getByCategoryId);
router.get('/projets/search/:keyword/:page/:limit', projetController.search);
router.put('/projet/:id/incrementLike', projetController.incrementLike);
router.put('/projet/:id/incrementDownloads', projetController.incrementDownload);

router.get('/projets/valide', projetController.getValidProjet);
router.get('/projets/invalide', projetController.getInvalidProjet);
router.get('/projets/attente', projetController.getPendingProjet);

router.put('/projet/:id/valide', projetController.setValidProjet);
router.put('/projet/:id/invalide', projetController.setInvalidProjet);
router.put('/projet/:id/attente', projetController.setPendingProjet);

module.exports = router;