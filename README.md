# News Aggregator API

This project serves as a backend for a News Aggregator application which allows one to create an account, add their preferences and read news articles based on them.

This service is implemented in [Node.js](https://nodejs.org/en) using [Express](https://expressjs.com/).
It stores the tasks in a custom-built [In-memory database](https://github.com/rishavbharti/taskmanager/tree/development/src/db/index.js).

## Project Setup

If you wish to run this project,
the first step is [installing Node.js](https://cloud.google.com/nodejs/docs/setup).

- Make sure Node.js version 18 LTS or later is installed.
- Setup Git and clone this repository to a working directory.
- Point a terminal to the project's folder and run `npm i` in the project root to install dependencies.

After finishing the setup, run `npm start` to start the development server. By default, server is set to run on port 8000 and can be accessed at [http://localhost:8000/](http://localhost:8000/).


## About
- To start with, user should register an account.
User password is stored in the database as a hashed string which is being done using `bcrypt`.
- Upon registration or login - along with the user details, a JWT is sent as a cookie which is automatically sent by the client in subsequent requests to verify the authenticity of the user.

- User preferences aren't set by default and hence would get news across all categories.
- The user has the option update it's preferences from the following options - `business, entertainment general, health, science, sports, technology`. 

- News is being fetched from [newsapi.ai](https://www.newsapi.ai/) and is cached for a duration of 2 hours.

- Upon requesting for news, the result will be sent segregated by category based on user's preferences.

## APIs

### Schema

The user schema looks as follows:

```
{
  "username": "Mandatory field. Length between 3 - 100 characters.,
  "email": "Mandatory field with valid pattern. Length between 6 - 1000 characters.
  "password": "Mandatory field. Stored as a hashed string",
  "preferences": [],
  "read": [],
  "favorites": [],
  "id": "1682097744037",
  "createdAt": "2023-04-21T17:22:24.037Z",
  "updatedAt": "2023-04-21T17:22:24.037Z"
}
```

- `id`, `createdAt` & `updatedAt` are populated by the database.

##

This application exposes the following endpoints at [/api](http://localhost:8000/api) route.



#### 1. POST /auth/register

```
@desc    Register an account
@route   POST /api/auth/register
@body    { name: string, email: string, password: string }
```
This returns the user details saved in the database, excluding the password. And a JWT as cookie.

#### 2. POST /auth/login

```
@desc    Login a user
@route   POST /api/auth/login
@body    { email: string, password: string }
```
This returns the user details saved in the database, excluding the password. And a JWT as cookie.

#### 3. GET /user/preferences

```
@desc    Get user preferences
@route   GET api/user/preferences
```

#### 4. PUT /user/preferences

```
@desc    Update user preferences
@route   PUT api/user/preferences
@body    Array of comma seperated strings // business, entertainment general, health, science, sports, technology
```

#### 5. GET /news

```
@desc    Get news
@route   GET api/news
```

For ease of testing, one can use the [news-aggregator Postman collection](https://github.com/rishavbharti/taskmanager/tree/development/news-aggregator.postman_collection.json) present in the repo.

#

## In-memory database

The database stores data in-memory as JSON. By default, data is indexed by the id.
Here's an example of how it looks like:

```
{
  Tasks: {
    _schema: {
      title: {
        type: 'String',
        trim: true,
        minLength: 3,
        maxLength: 100,
        required: true
      },
      priority: {
        type: 'String',
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      }
    },
    store: {
      1682100568216: {
        "title": "Task 1",
        "description": "Description",
        "completed": true,
        "priority": "medium",
        "id": "1682100568216",
        "createdAt": "2023-04-21T18:09:28.216Z",
        "updatedAt": "2023-04-21T18:09:28.216Z"
      }
    }
  }
}
```

Database can be instantiated with the name of the collection and the schema.
The schema is stored in the `_schema` property and is used for validating data in `POST` & `PUT` operations.
It populates `id`, `createdAt`, and `updatedAt` by default for every item.

Besides supporting Create, Read, Update & Delete operations, it can also be queried using the filters - `$in`, `$gt` and `$lt`.
Here's an example for the same.

```
- This will return all the tasks with priority low and medium: { 'priority': { '$in': ['low', 'medium'] } }
- This will return all the items with rating greater than 4 : { 'rating': { '$gt': 4 } }
```

It supports sorting data on a given property in ascending & descending order.
Here's an example for the same.

```
{ 'sortBy': 'createdAt', 'orderBy': 'asc' }
```
