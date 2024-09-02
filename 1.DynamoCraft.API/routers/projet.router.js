const express = require("express");
const router = express.Router();
const projetController = require("../controllers/projet.controller");
const upload = require("../tools/multerConfig.tools");
const estAutorise = require("../middleware/estAutorise.middleware");

router.post("/projet", estAutorise(1), upload.array("images", 8), projetController.create);
router.get("/projets", projetController.getAll);
router.get("/projet/top", projetController.getTop10Liked);
router.get("/projet/last", projetController.getLast);
router.get("/projet/:id", projetController.getById);
router.get("/projet/:id/utilisateur", projetController.getByUserId);
router.put("/projet/:id", estAutorise(1), projetController.updateById);
router.delete("/projet/:id", estAutorise(1), projetController.delete);
router.get("/projet/:id/categorie", estAutorise(1), projetController.getByCategoryId);
router.get("/projets/search/:keyword/:page/:limit", projetController.search);
router.put("/projet/:id/incrementLike", estAutorise(1), projetController.incrementLike);
router.put("/projet/:id/incrementDownloads", estAutorise(1), projetController.incrementDownload);
router.get("/projet/downloaded/:id/utilisateur", projetController.getDownloadedByUser);

router.get("/projets/valide", estAutorise(2), projetController.getValidProjet);
router.get("/projets/invalide", estAutorise(2), projetController.getInvalidProjet);
router.get("/projets/attente", estAutorise(2), projetController.getPendingProjet);

router.put("/projet/:id/valide", estAutorise(2), projetController.setValidProjet);
router.put("/projet/:id/invalide", estAutorise(2), projetController.setInvalidProjet);
router.put("/projet/:id/attente", estAutorise(2), projetController.setPendingProjet);

module.exports = router;
