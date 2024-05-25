const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../db');
const User = db.users;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(403).json({ 
                status: 403,
                message: 'User already registered with this email!' 
            });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate JWT access and refresh tokens
        const accessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '1s' });
        const refreshToken = jwt.sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: '1y' });

        // Set cookies for the access and refresh tokens
        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true });

        res.status(201).json({ message: 'User registered successfully!', accessToken });
    } 
    catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to register the user!', 
            error 
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                status: 404, 
                message: 'Unable to find the user associated with the email!' 
            });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                status: 400,
                message: 'Invalid password!' 
            });
        }

        // Generate JWT access and refresh tokens
        const accessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '1s' });
        const refreshToken = jwt.sign({ id: user.id, email: user.email }, REFRESH_TOKEN_SECRET, { expiresIn: '1y' });

        // Set cookies for the access and refresh tokens
        res.cookie("accessToken", accessToken, { httpOnly: true });
        res.cookie("refreshToken", refreshToken, { httpOnly: true });

        res.status(200).json({ message: 'User logged in successfully!', accessToken });
    } 
    catch (error) {
        res.status(500).json({
            status: 500, 
            message: 'Unable to login the user!', 
            error 
        });
    }
};

const logoutUser = (req, res) => {
    // Clear the access and refresh token cookies
    res.clearCookie('accessToken', { httpOnly: true });
    res.clearCookie('refreshToken', { httpOnly: true });

    res.status(200).json({ message: 'User logged out successfully!' });
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser
};
