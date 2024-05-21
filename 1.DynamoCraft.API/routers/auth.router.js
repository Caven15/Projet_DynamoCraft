const express = require("express")
const router = express.Router()
const authControlleur = require("../controllers/Auth.controller")

// Route de test
router.post("/routeTest", authControlleur.test)

module.exports = router