const { body, validationResult } = require('express-validator');

const updateUser = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty!'),
    body('password').optional().isLength({ min: 8 }).withMessage('Password must be at least 8 characters long!'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Unable to update the user!',
                errors: errors.array()
            });
        }

        next();
    }
];

module.exports = {
    updateUser
};
