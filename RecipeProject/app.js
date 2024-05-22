const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');

const multer = require('multer');
const path = require('path');

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    filename: function (req, file, cb) {
        console.log(path.extname(file.originalname));
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const app = express();

var corsOption = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200
};
app.use(cors(corsOption));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes(upload));
app.use('/api/reviews', reviewRoutes)

async function start(port) {
    return new Promise((resolve) => app.listen({ port }, resolve));
}
 
module.exports = {
  start,
  upload
};
