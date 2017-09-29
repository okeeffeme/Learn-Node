const express = require('express');
const router = express.Router();
const statueController = require('../controllers/statueController')

// Do work here
router.get('/', statueController.homepage);

module.exports = router;
