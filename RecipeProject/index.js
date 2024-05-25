const app = require('./app');
const db = require('./db');

// Set the port number to the value of the PORT environment variable, or default to 3001 if it's not set
const PORT = process.env.PORT || 3001;

// Synchronize the database and start the server once the database is ready
db.sync().then(() => {
    // Start the application on the specified port
    app.start(PORT).then(() => {
        console.log("Server Running On Port 3001!");
    });
});

module.exports = app;
