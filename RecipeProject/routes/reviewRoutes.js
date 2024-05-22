const express = require('express');
const router = express.Router();

const reviewController = require('../controllers/reviewController');
const reviewValidator = require('../middlewares/reviewValidator');
const tokenValidator = require('../middlewares/tokenValidator');

router.get('/:id', reviewController.getReview);
router.get('/user/:userId', reviewController.getUserReviews);
router.get('/recipe/:recipeId', reviewController.getReviews);

router.post('/:recipeId', tokenValidator.accessToken, reviewValidator.createReview, reviewController.createReview);

router.put('/:id', tokenValidator.accessToken, reviewValidator.updateReview, reviewController.updateReview);

router.delete('/:id', tokenValidator.accessToken, reviewController.deleteReview);

module.exports = router;
