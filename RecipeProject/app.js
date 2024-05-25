const express = require("express");
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// Configure multer storage settings for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination folder for uploaded files
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        // Set the filename for uploaded files, using the current timestamp and original file extension
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Create an instance of multer with the specified storage settings
const upload = multer({ storage: storage });

// Create an instance of an Express application
const app = express();

// Use middleware to parse JSON bodies in requests
app.use(express.json());

// Use middleware to parse URL-encoded bodies in requests
app.use(express.urlencoded({ extended: true }));

// Use middleware to parse cookies in requests
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes(upload));
app.use('/api/reviews', reviewRoutes);

// Function to start the server on the specified port
async function start(port) {
    return new Promise((resolve) => app.listen({ port }, resolve));
}

module.exports = {
  start,
  upload
};
