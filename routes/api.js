const express = require('express');
const router = express.Router();
const ApiController = require('../controllers/apicontroller');


router.get('/', ApiController.getDollarBlue);

module.exports = router