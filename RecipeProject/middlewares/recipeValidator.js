const { body, validationResult } = require('express-validator');

const createRecipe = [
    body('name').notEmpty().withMessage('Name is required!'),
    body('ingredients').isArray().withMessage('Ingredients must be an array!').notEmpty().withMessage('Ingredients are required!'),
    body('instructions').isArray().withMessage('Instructions must be an array!').notEmpty().withMessage('Instructions are required!'),
    
    (req, res, next) => {
        const errors = validationResult(req);

        if (!(errors.isEmpty())) {
            return res.status(400).json({
                status: 400, 
                message: 'Unable to create the recipe!', 
                errors: errors.array() });
        }

        next();
    }
];

const updateRecipe = [
    body('name').optional().notEmpty().withMessage('Name is required!'),
    body('ingredients').optional().isArray().withMessage('Ingredients must be an array!').notEmpty().withMessage('Ingredients are required!'),
    body('instructions').optional().isArray().withMessage('Instructions must be an array!').notEmpty().withMessage('Instructions are required!'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: 'Unable to update the recipe!',
                errors: errors.array()
            });
        }

        next();
    }
];

module.exports = {
    createRecipe,
    updateRecipe
};
