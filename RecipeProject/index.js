const app = require('./app');
const db = require('./db');
const PORT = process.env.PORT || 3001

db.sync().then(() => {
    app.start(PORT).then(() => {
        console.log("Server Running On Port 3001!");
    });
});

module.exports = app;