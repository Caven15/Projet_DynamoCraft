const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorie.controller');
const estAutorise = require('../middleware/estAutorise.middleware');

router.post('/categorie', estAutorise(3), categorieController.create);
router.put('/categorie/:id', estAutorise(3), categorieController.update);
router.get('/categorie/:id', estAutorise(1), categorieController.getById);
router.get('/categories', categorieController.getAll);

module.exports = router;
