const { body, validationResult } = require('express-validator');

const registerUser = [
    body('name').notEmpty().withMessage('Name is required!'),
    body('email').isEmail().withMessage('Invalid email address!'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long!'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                status: 400,
                message: 'Unable to register the user!',
                errors: errors.array()
            });
        }

        next();
    }
];

const loginUser = [
    body('email').isEmail().withMessage('Invalid email address!'),
    body('password').notEmpty().withMessage('Password is required!'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                status: 400,
                message: 'Unable to login the user!',
                errors: errors.array()
             });
        }

        next();
    }
];

module.exports = {
    registerUser,
    loginUser
}