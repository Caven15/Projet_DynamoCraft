const express = require('express');
const router = express.Router();
const categorieController = require('../controllers/categorie.controller');

router.post('/categorie', categorieController.create);
router.put('/categorie/:id', categorieController.update);
router.get('/categorie/:id', categorieController.getById);
router.get('/categories', categorieController.getAll);

module.exports = router;
