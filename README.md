# RecipeProject-NodeJS

## Description
This API allows users to manage recipes and reviews. Users can create, update, delete, and view recipes. Additionally, users can add reviews to recipes, and each recipe has a rating system based on user reviews. This API supports image uploads for recipes, allowing users to associate pictures with their recipes.

<br>

## Features
- User authentication and authorization
- CRUD operations for recipes
- Image upload for recipes
- Adding reviews to recipes
- Updating and deleting reviews
- Rating system for recipes based on reviews

<br>

## Setup Steps
### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)
- MySQL

### Installation
1. Clone the repository:

```bash
git clone git@github.com:maraneagu/RecipeProject-NodeJS.git
cd RecipeProject
```

2. Install the dependencies:

```bash
npm install
```

3. Create a .env file in the root of the project and add the following environment variables:

```
PORT = The port on which the server will run.
DATABASE_URL = The url of the MySQL database.
ACCESS_TOKEN_SECRET = The secret key for signing access tokens.
REFRESH_TOKEN_SECRET = The secret key for signing refresh tokens.
```

<br>

## API Endpoints
### Authentication

`POST /api/auth/login` 
- Login and receive access and refresh tokens.

`POST /api/auth/register`
- Register a new user and receive access and refresh tokens.

`POST /api/auth/logout` 
- Logout of the account.

<br>

### User

`GET /api/users` 
- Get all the users.

`GET /api/users/:id`
- Get a user associated with an id.

`PUT /api/users/:id` 
- Update a user's name or password associated with an id. 

`DELETE /api/users/:id` 
- Delete a user's account associated with an id.

<br>

### Recipe

`GET /api/recipes` 
- Get all the recipes.

`GET /api/recipes/:id`
- Get a recipe associated with an id.

`GET /api/recipes/user/:userId`
- Get a recipe created by a user associated with an id.

`POST /api/recipes`
- Create a recipe.

`PUT /api/recipes/:id` 
- Update a recipe's name, ingredient's list or instruction's associated with an id. 

`DELETE /api/users/:id` 
- Delete a recipe associated with an id.

<br>

### Review

`GET /api/reviews/:id` 
- Get a review associated with an id.

`GET /api/reviews/user/:userId`
- Get all the reviews written by a user associated with an id.

`GET /api/reviews/recipe/:recipeId`
- Get all the reviews of a recipe associated with an id.

`POST /api/reviews/:recipeId`
- Add a review to a recipe associated with an id.

`PUT /api/reviews/:id` 
- Update a review's text or rating associated with an id. 

`DELETE /api/reviews/:id` 
- Delete a review associated with an id.
