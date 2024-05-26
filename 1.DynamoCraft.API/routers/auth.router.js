const express = require("express")
const router = express.Router()
const authControlleur = require("../controllers/Auth.controller")
const upload = require("../tools/multerConfig.tools")

// Route lié a l'authentification
router.post("/auth/register", upload.single("image"), authControlleur.register)

router.post("/auth/login", authControlleur.login)

module.exports = router