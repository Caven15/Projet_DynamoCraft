const express = require('express');
const router = express.Router();
const modele3DController = require('../controllers/modele3D.controller');
const multerConfig3D = require('../tools/multerConfig3D.tools');
const estAutorise = require('../middleware/estAutorise.middleware');

router.post('/modeles3d', estAutorise(1), multerConfig3D.array('files', 25), modele3DController.create);
router.put('/modele3d/:id/projet', estAutorise(1), multerConfig3D.array('files', 25), modele3DController.updateByProjetId);
router.get('/modeles3d/:id/projet', modele3DController.getByProjetId);
router.delete('/modeles3d/:id', estAutorise(1), modele3DController.delete);

module.exports = router;
