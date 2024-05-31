const express = require("express")
const router = express.Router()
const authControlleur = require("../controllers/auth.controller")
const upload = require("../tools/multerConfig.tools")

router.post("/auth/register", upload.single("image"), authControlleur.register)
router.post("/auth/login", authControlleur.login)
router.post("/auth/resetPassword", authControlleur.resetPassword)

module.exports = router