const express = require('express');
const router = express.Router();
const statueController = require('../controllers/statueController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(statueController.getStatues));
router.get('/statues', statueController.getStatues);
router.get('/add', statueController.addStatue);

router.post('/add',
  statueController.upload,
  catchErrors(statueController.resize),
  catchErrors(statueController.createStatue)
);
router.post('/add/:id',
  statueController.upload,
  catchErrors(statueController.resize),
  catchErrors(statueController.updateStatue)
);

router.get('/statues/:id/edit', catchErrors(statueController.editStatue));

router.get('/statue/:slug', catchErrors(statueController.getStatueBySlug));


//Users
router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);

//1. Validate the registration data
//2. register the user
//3. we need to log them in
router.post('/register',
  userController.validateRegister,
  // we need to know about errors if
  // validation will be passed, but registration
  // will be failed in some reasons, e.g. second
  // registration with same email
  catchErrors(userController.register),
  authController.login
);

module.exports = router;
