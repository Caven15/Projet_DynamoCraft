const express = require("express");
const router = express.Router();
const authControlleur = require("../controllers/Auth.controller");
const upload = require("../tools/multerConfig.tools");
const estAutorise = require('../middleware/estAutorise.middleware');


router.post("/auth/register", upload.single("image"), authControlleur.register);
router.post("/auth/login", authControlleur.login);
router.post("/auth/resetPassword", estAutorise(1), authControlleur.resetPassword);
router.post('/auth/mot-de-passe-oublie', authControlleur.forgotPassword);
router.post('/auth/reset-mot-de-passe-oublie', authControlleur.resetForgotPassword);

module.exports = router;