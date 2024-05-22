const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authValidator = require('../middlewares/authValidator');
const tokenValidator = require('../middlewares/tokenValidator');

router.post('/register', authValidator.registerUser, authController.registerUser);
router.post('/login', authValidator.loginUser, authController.loginUser);
router.post('/logout', tokenValidator.accessToken, authController.logoutUser);

module.exports = router;
