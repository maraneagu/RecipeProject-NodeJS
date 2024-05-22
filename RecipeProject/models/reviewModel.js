module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define("review", {
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        recipeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'recipes',
                key: 'id'
            },
            onDelete: 'CASCADE'
        }
    });

    Review.associate = function(models) {
        Review.belongsTo(models.Recipe, { foreignKey: 'recipeId', as: 'recipe' });
        Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    };
    
    return Review;
};
