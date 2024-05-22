const { body, validationResult } = require('express-validator');

const createReview = [
    body('text').notEmpty().withMessage('Text is required!'),
    body('rating').notEmpty().withMessage('Rating is required!'),
    
    (req, res, next) => {
        const errors = validationResult(req);

        if (!(errors.isEmpty())) {
            return res.status(400).json({ message: 'Unable to create the review!', errors: errors.array() });
        }

        next();
    }
];

const updateReview = [
    body('text').optional().notEmpty().withMessage('Text is required!'),
    body('rating').optional().notEmpty().withMessage('Rating is required!'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Unable to update the review!',
                errors: errors.array()
            });
        }

        next();
    }
];

module.exports = {
    createReview,
    updateReview
}