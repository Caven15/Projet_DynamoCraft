const express = require('express');
const router = express.Router();
const mailController = require('../controllers/email.controller');

router.post('/contact', mailController.contact);

module.exports = router;


module.exports = router;
