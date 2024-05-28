const express = require('express');
const router = express.Router();
const statistiqueController = require('../controllers/statistique.controller');

router.post('/statistique', statistiqueController.create);
router.put('/statistique/:id', statistiqueController.update);
router.get('/statistique/totals', statistiqueController.getTotals);
router.put('/statistique/:id/incrementDownloads', statistiqueController.incrementDownloads);
router.put('/statistique/:id/incrementLikes', statistiqueController.incrementLikes);

module.exports = router;