const db = require('../db');

const Review = db.reviews;
const Recipe = db.recipes;

const getReview = async (req, res) => {
    try {
        const id = req.params.id;

        // Find the review by its primary key (id)
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({
                status: 404, 
                message: 'Unable to find a review associated with the id!' 
            });
        }

        res.status(200).send(review);
    } 
    catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to get the review!', 
            error 
        });
    }
};

const getReviews = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;

        // Find the recipe by its primary key (id)
        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({
                status: 404, 
                message: 'Unable to find a recipe associated with the id!' 
            });
        }

        // Find all reviews for the specified recipe, ordered by rating in descending order
        const reviews = await Review.findAll({
            where: { recipeId },
            order: [['rating', 'DESC']]
        });

        if (reviews.length === 0) {
            return res.status(404).json({ 
                status: 404,
                message: 'Unable to find the reviews for the recipe!' 
            });
        }

        res.status(200).send(reviews);
    } 
    catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to get the reviews for the recipe!', 
            error 
        });
    }
};

const getUserReviews = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all reviews created by the user, ordered by rating in descending order
        const reviews = await Review.findAll({
            where: { userId },
            order: [['rating', 'DESC']]
        });

        if (reviews.length === 0) {
            return res.status(404).json({
                status: 404, 
                message: 'Unable to find the reviews created by the specific user!' 
            });
        }

        res.status(200).json(reviews);
    } 
    catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to get the reviews for the user!', 
            error 
        });
    }
};

const createReview = async (req, res) => {
    try {
        const { text, rating } = req.body;
        
        // Get the recipe ID from the request parameters and the user ID from the authenticated user
        const recipeId = parseInt(req.params.recipeId, 10);
        const userId = req.user.id;

        // Find the recipe by its primary key (id)
        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({
                status: 404, 
                message: 'Unable to find a recipe associated with the id!' 
            });
        }

        // Check if a review already exists for the user and recipe
        const existingReview = await Review.findOne({ where: { userId, recipeId }});
        if (existingReview) {
            return res.status(403).json({
                status: 403,
                message: 'A review was already posted for the recipe! Update the original one!'
            });
        }

        const review = await Review.create({
            text,
            rating,
            userId,
            recipeId
        });

        // Update the number of reviews and average rating for the recipe
        const newNumberOfReviews = recipe.numberOfReviews + 1;
        const newRating = ((recipe.rating * recipe.numberOfReviews) + rating) / newNumberOfReviews;

        recipe.numberOfReviews = newNumberOfReviews;
        recipe.rating = newRating;

        await recipe.save();

        res.status(201).json({ message: 'Review created successfully!', review });
    } 
    catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to create the review!', 
            error 
        });
    }
};

const updateReview = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id; // Get the user ID from the authenticated user

        // Find the review by its primary key (id)
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ 
                status: 404,
                message: 'Unable to find a review associated with the id!' 
            });
        }

        // Check if the authenticated user is the owner of the review
        if (review.userId !== userId) {
            return res.status(401).json({ 
                status: 401,
                message: 'Unauthorized to update the review!' 
            });
        }

        // Find the associated recipe
        const recipe = await Recipe.findByPk(review.recipeId);
        if (!recipe) {
            return res.status(404).json({ 
                status: 404,
                message: 'Unable to find the recipe associated with the review!' 
            });
        }

        // Update the rating for the recipe if the rating is provided
        const { rating } = req.body;
        if (rating !== undefined) {
            const currentRating = recipe.rating * recipe.numberOfReviews;
            const newRating = (currentRating - review.rating + rating) / recipe.numberOfReviews;
            
            recipe.rating = newRating;
            await recipe.save();
        }

        await Review.update(req.body, { where: { id } });

        res.status(200).json({ message: 'Review updated successfully!' });
    } 
    catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to update the review!', 
            error 
        });
    }
};

const deleteReview = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.user.id; // Get the user ID from the authenticated user

        // Find the review by its primary key (id)
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).json({ 
                status: 404,
                message: 'Unable to find a review associated with the id!' 
            });
        }

        // Check if the authenticated user is the owner of the review
        if (review.userId !== userId) {
            return res.status(401).json({ 
                status: 401,
                message: 'You are not authorized to delete the review!' 
            });
        }

        // Find the associated recipe
        const recipe = await Recipe.findByPk(review.recipeId);
        if (!recipe) {
            return res.status(404).json({ 
                status: 404,
                message: 'Unable to find the recipe associated with the review!' 
            });
        }

        // Update the number of reviews and average rating for the recipe
        const currentRating = recipe.rating * recipe.numberOfReviews;
        const newNumberOfReviews = recipe.numberOfReviews - 1;
        
        let newRating;
        if (newNumberOfReviews === 0) {
            newRating = 0;
        } else {
            newRating = (currentRating - review.rating) / newNumberOfReviews;
        }

        recipe.numberOfReviews = newNumberOfReviews;
        recipe.rating = newRating;

        // Save the updated recipe and delete the review
        await recipe.save();
        await review.destroy();

        res.status(200).json({ message: 'Review deleted successfully!' });
    } 
    catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to delete the review!', 
            error 
        });
    }
};

module.exports = {
    getReview,
    getReviews,
    getUserReviews,
    createReview,
    updateReview,
    deleteReview
}