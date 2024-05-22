const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const userValidator = require('../middlewares/userValidator');
const tokenValidator = require('../middlewares/tokenValidator');

router.get('', tokenValidator.accessToken, userController.getUsers);
router.get('/:id', tokenValidator.accessToken, userController.getUser);

router.put('/:id', tokenValidator.accessToken, userValidator.updateUser, userController.updateUser);

router.delete('/:id', tokenValidator.accessToken, userController.deleteUser);

module.exports = router;
