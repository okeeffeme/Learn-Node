const express = require('express');
const router = express.Router();
const statueController = require('../controllers/statueController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', statueController.homepage);
router.get('/add', statueController.addStatue);
router.post('/add', catchErrors(statueController.createStatue));

module.exports = router;
