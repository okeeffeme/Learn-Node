const express = require('express');
const router = express.Router();
const statueController = require('../controllers/statueController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(statueController.getStatues));
router.get('/statues', statueController.getStatues);
router.get('/add', statueController.addStatue);
router.post('/add', catchErrors(statueController.createStatue));
router.post('/add/:id', catchErrors(statueController.updateStatue));
router.get('/statues/:id/edit', catchErrors(statueController.editStatue));

module.exports = router;
