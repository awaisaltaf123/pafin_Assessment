# Pafin Assessment

Welcome to the documentation for your project's API. This document provides clear instructions on how to run the code and test the API.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Project Structure](#project-structure)
- [Running the API](#running-the-api)
- [API Endpoints](#api-endpoints)
- [Testing the API](#testing-the-api)

## Getting Started

Follow these steps to get your API up and running.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (>= 12.x)
- npm or yarn
- PostgreSQL database

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/your-project.git
   ```

2. Navigate to the project directory:

   ```bash
   cd your-project
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Configuration

1. For this Project I have given the env if for some reason it is missing then do the following.
   Create a .env file in the root directory based on the provided .env.example file.

   ```bash
   JWT_SECRET_KEY=JWT_SECRET_KEY = j63Ll4vWnH0KwygTj7bTj0ymK00QJ3DkGn4h6UFqwMNOFYMgjAWERDIQ2Ma5YA36tatzVyB54UvRNqHQ6mbOCbZZIrGvAG4w1JzDvohIDN5A27zGOZ4FOtG6jjofgpAo4jxeujzKPcdUfXGhDx4wdZXSwmQMGiLoce8XrLdcD25WjjQN3O4UJXNVxQHz7ME8BAqGuMkYuhTvixorC5uK5igv9h3eunUXUw43szPwPWGNq3G6W7wO6RBqjTi0k5HB

   ```

2. Now create a DB and its schema for this project for this

   ```bash
   cd src/models/database.sql
   and create this DB and its corresponding table.

   ```

3. Now go to the `db.ts` and change its value that you have set during the postgres DB setup

   ```bash
   user: "postgres",
   password: "password",
   host: "localhost",
   port: 5432,
   database: "pafin"
   ```

## Project Structure

The folder structure of this app is explained below:

| Name             | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| **node_modules** | Contains all npm dependencies                                                          |
| **package json** | Contains all the info related to the project setup and any packages that are installed |
| **index**        | The main file where the project is running                                             |
| **routes**       | Contains all the routes of the User table.                                             |
| **middleware**   | It verifies the user token here.                                                       |
| **models**       | Contains the information regarding the database here.                                  |
| **cotroller**    | It has all the businesss Logic here.                                                   |
| **services**     | It has all the sensetive businesss Logic here.                                         |

## Running the API

To start the API server, run the following command:

```bash
npm run dev
```

The API will be accessible at
http://localhost:5000.

## API Endpoints

Below are the available API endpoints:

- POST /user: Create a new user.
- POST /login: User login.

  Protected routes:

- GET /users: Get a list of all users.
- GET /users/:id: Get user details by ID.
- PUT /users/:id: Update user information.
- DELETE /users/:id: Delete a user.

Please refer to the API documentation or code comments for more details on request and response formats.

## Testing the API

To test the APIs, you can use any API platform such as Insomnia or Postman. There are two steps you need to follow to access the APIs correctly:

1. The first step is to create a user. To achieve this, make a request to the following API endpoint while providing the required information (name, email, and password) in the request body:

```
POST /user: Create a new user.
```

2. The next step is to obtain an access token. For this purpose, make a request to the login API. You should provide the email and password associated with the credentials you used to create the user.

```
POST /login: User login.
```

Once you successfully receive the access token, you are ready to proceed.

# Additional Endpoints

To access the additional endpoints for retrieving, updating, or deleting user information, you need to include the access token in the headers of your requests. Add an "Authorization" header with the value "Bearer <access_token>". This is how you prove your identity and access the protected routes.

- To retrieve a list of all users:

```
GET /users: Get a list of all users.
```

- To retrieve user details by their ID:

```
GET /users/:id: Get user details by ID.
```

- To update user information, provide the user ID along with the data to update:

```
PUT /users/:id: Update user information.
```

- To delete a user by their ID:

```
DELETE /users/:id: Delete a user.
```

## Video Demonstration

You can watch a demonstration of the API usage by clicking on the following video link:

[![Watch the video](https://cdn.loom.com/sessions/thumbnails/fcf70f5c4d5a4a6ea86051ef323e894a-with-play.gif)](https://www.loom.com/share/fcf70f5c4d5a4a6ea86051ef323e894a)
