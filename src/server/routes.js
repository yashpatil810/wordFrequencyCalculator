const express = require('express');
const router = express.Router();

var controller = require('./apiController')
router.post('/api', (controller.getApi))

module.exports = router