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

```bash
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

