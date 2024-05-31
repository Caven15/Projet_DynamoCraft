const express = require('express');
const router = express.Router();
const modele3DController = require('../controllers/modele3D.controller');
const multerConfig3D = require('../tools/multerConfig3D.tools');

router.post('/modeles3d', multerConfig3D.array('files', 25), modele3DController.create);
router.get('/modeles3d/:id/projet', modele3DController.getByProjetId);
router.delete('/modeles3d/:id', modele3DController.delete);

module.exports = router;
