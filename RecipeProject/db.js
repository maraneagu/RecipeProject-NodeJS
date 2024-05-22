const {Sequelize, DataTypes} = require("sequelize");
const dotenv = require("dotenv");
dotenv.config({ path: './.env' });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully!');
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });


const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.users = require('./models/userModel.js')(sequelize, DataTypes);
db.recipes = require('./models/recipeModel.js')(sequelize, DataTypes)
db.reviews = require('./models/reviewModel.js')(sequelize, DataTypes)

db.sync = () => {
    return db.sequelize.sync({ force: false })
        .then(() => {
            console.log('Re-sync completed successfully!');
        })
        .catch(error => {
            console.error('Unable to re-sync the database:', error);
        });
};

module.exports = db