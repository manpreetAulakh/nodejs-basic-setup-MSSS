const express = require('express');
const { body } = require('express-validator');

const User = require('../models/User');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const router = express.Router();

router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {    
        return User.findOne({ where: { email: value } }).then(user => {
          if (user) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.signup
);

router.post('/login', authController.login);
router.get('/dummyAPI', isAuth, authController.dummyAPI);


module.exports = router;
