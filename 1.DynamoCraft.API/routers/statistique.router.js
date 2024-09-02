const express = require('express');
const router = express.Router();
const statistiqueController = require('../controllers/statistique.controller');
const estAutorise = require("../middleware/estAutorise.middleware");

router.post('/statistique', estAutorise(1),  statistiqueController.create);

router.put('/statistique/:id', estAutorise(1),  statistiqueController.update);

router.get('/statistique/totals', estAutorise(1),  statistiqueController.getTotals);

router.get('/statistique/average-downloads', estAutorise(2),  statistiqueController.getAverageDownloads);

router.get('/statistique/average-likes', estAutorise(2),  statistiqueController.getAverageLikes);

router.get('/statistique/most-commented', estAutorise(2),  statistiqueController.getMostCommentedProjets);

router.get('/statistique/projets/statut', estAutorise(2),  statistiqueController.getProjetsByStatut);

router.get('/statistique/projets/categorie', estAutorise(2),  statistiqueController.getProjetsByCategorie);

router.get('/statistique/top5-downloads', estAutorise(2),  statistiqueController.getTop5DownloadedProjets);

router.get('/statistique/downloads-evolution', estAutorise(2),  statistiqueController.getDownloadsEvolutionByMonth);

router.get('/statistique/downloads-evolution/week', estAutorise(2),  statistiqueController.getDownloadsEvolutionByWeek);

router.get('/statistique/downloads-evolution/day', estAutorise(2),  statistiqueController.getDownloadsEvolutionByDay);

module.exports = router;
