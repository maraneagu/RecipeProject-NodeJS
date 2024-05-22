module.exports = (sequelize, DataTypes) => {
    const Recipe = sequelize.define("recipe", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ingredients: {
            type: DataTypes.JSON,
            allowNull: false
        },
        instructions: {
            type: DataTypes.JSON,
            allowNull: false
        },
        numberOfReviews: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        rating: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0
        },
        pictureUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    });

    Recipe.associate = function(models) {
        Recipe.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };
    
    return Recipe;
};
