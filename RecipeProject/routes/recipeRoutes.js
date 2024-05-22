const express = require('express');
const router = express.Router();

const recipeController = require('../controllers/recipeController');
const recipeValidator = require("../middlewares/recipeValidator");
const tokenValidator = require('../middlewares/tokenValidator');

module.exports = function(upload) {
    router.get('', recipeController.getRecipes);
    router.get('/user/:userId', recipeController.getUserRecipes);
    router.get('/:id', recipeController.getRecipe);

    router.post('', tokenValidator.accessToken, upload.single('pictureUrl'), recipeValidator.createRecipe, recipeController.createRecipe); // Use upload middleware here

    router.put('/:id', tokenValidator.accessToken, upload.single('pictureUrl'), recipeValidator.updateRecipe, recipeController.updateRecipe);

    router.delete('/:id', tokenValidator.accessToken, recipeController.deleteRecipe);

    return router;
};