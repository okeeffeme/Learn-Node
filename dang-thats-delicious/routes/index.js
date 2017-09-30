const express = require('express');
const router = express.Router();
const statueController = require('../controllers/statueController')

// Do work here
router.get('/', statueController.homepage);
router.get('/add', statueController.addStatue);

module.exports = router;
