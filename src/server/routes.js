const express = require('express');
const router = express.Router();

var controller = require('./apiController') // GET THE CONTROLLER
router.post('/api', (controller.getApi))    // POST REQUEST TO FETCH THE WORDS

module.exports = router