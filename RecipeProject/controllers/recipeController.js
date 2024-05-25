const db = require('../db');
const Recipe = db.recipes;

const getRecipe = async (req, res) => {
    try {
        const id = req.params.id;

        // Find the recipe by its primary key (id)
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({
                status: 404, 
                message: 'Unable to find a recipe associated with the id!' 
            });
        }

        res.status(200).send(recipe);
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to get the recipe!', 
            error 
        });
    }
};

const getRecipes = async (req, res) => {
    try {
        // Find all recipes and order them by rating in descending order
        const recipes = await Recipe.findAll({ order: [['rating', 'DESC']] });
        if (recipes.length === 0) {
            return res.status(404).json({ 
                status: 404,
                message: 'Unable to find the recipes!' 
            });
        }

        res.status(200).send(recipes);
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to get the recipes!', 
            error 
        });
    }
};

const getUserRecipes = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all recipes created by the user and order them by rating in descending order
        const recipes = await Recipe.findAll({ 
            where: { userId },
            order: [['rating', 'DESC']] 
        });

        if (recipes.length === 0) {
            return res.status(404).json({
                status: 404, 
                message: 'Unable to find the recipes created by the user!' 
            });
        }

        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to get the recipes for the user!', 
            error 
        });
    }
};

const createRecipe = async (req, res) => {
    try {
        const { name, ingredients, instructions } = req.body;
        const userId = req.user.id; // Get the user ID from the authenticated user
        const pictureUrl = req.file ? `/images/${req.file.filename}` : null; // Get the uploaded file URL if present

        const recipe = await Recipe.create({
            name,
            ingredients,
            instructions,
            numberOfReviews: 0,
            rating: 0.0,
            pictureUrl,
            userId,
        });

        res.status(201).json({ message: 'Recipe created successfully!', recipe });
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to create the recipe!', 
            error 
        });
    }
};

const updateRecipe = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id; // Get the user ID from the authenticated user
        const pictureUrl = req.file ? `/images/${req.file.filename}` : null; // Get the uploaded file URL if present

        // Find the recipe by its primary key (id)
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ 
                status: 404,
                message: 'Unable to find a recipe associated with the id!' 
            });
        }

        // Check if the authenticated user is the owner of the recipe
        if (recipe.userId !== userId) {
            return res.status(401).json({ 
                status: 401,
                message: 'Unauthorized to update the recipe!' 
            });
        }

        await Recipe.update( { ...req.body, pictureUrl }, { where: { id } });

        res.status(200).json({ message: 'Recipe updated successfully!' });
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to update the recipe!', 
            error 
        });
    }
};

const deleteRecipe = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id; // Get the user ID from the authenticated user

        // Find the recipe by its primary key (id)
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ 
                status: 404,
                message: 'Unable to find the recipe associated with the id!' 
            });
        }

        // Check if the authenticated user is the owner of the recipe
        if (recipe.userId !== userId) {
            return res.status(401).json({ 
                status: 401,
                message: 'Unauthorized to delete the recipe!' 
            });
        }

        await Recipe.destroy({ where: { id } });

        res.status(200).json({ message: 'Recipe deleted successfully!' });
    } 
    catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to delete the recipe!', 
            error 
        });
    }
}

module.exports = {
    getRecipe,
    getRecipes,
    getUserRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe
};
