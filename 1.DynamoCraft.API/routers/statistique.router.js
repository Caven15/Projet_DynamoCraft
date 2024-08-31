const express = require('express');
const router = express.Router();
const statistiqueController = require('../controllers/statistique.controller');

router.post('/statistique', statistiqueController.create);
router.put('/statistique/:id', statistiqueController.update);
router.get('/statistique/totals', statistiqueController.getTotals);
router.get('/statistique/average-downloads', statistiqueController.getAverageDownloads);
router.get('/statistique/average-likes', statistiqueController.getAverageLikes);
router.get('/statistique/downloads-evolution', statistiqueController.getDownloadsEvolutionByMonth);
router.get('/statistique/most-commented', statistiqueController.getMostCommentedProjets);

router.get('/statistique/projets/statut', statistiqueController.getProjetsByStatut);
router.get('/statistique/projets/categorie', statistiqueController.getProjetsByCategorie);
router.get('/statistique/top5-downloads', statistiqueController.getTop5DownloadedProjets);


router.get('/statistique/downloads-evolution/week', statistiqueController.getDownloadsEvolutionByWeek);
router.get('/statistique/downloads-evolution/day', statistiqueController.getDownloadsEvolutionByDay);
module.exports = router;