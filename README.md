# News Aggregator API

## Overview

This is a **News Aggregator API** built using **Node.js, Express, and MongoDB**. The API allows users to register, log in, manage their preferences, and fetch news articles based on their preferences.

## Features

- **User Authentication:**
  - User registration with email, name, password, and preferences.
  - User login with email and password.
  - JWT-based authentication for secure access to protected routes.
- **Preferences Management:**
  - Retrieve user preferences.
  - Update user preferences.
- **News Aggregation:**
  - Fetch news articles based on user preferences using an external News API.
  - Caching for faster access.
  - Mark news as read or favorite.
  - Search for news based on keywords.
- **Automated Updates:**
  - A cron job updates the news cache every hour.
- **Comprehensive Error Handling:**
  - Handles missing fields, invalid tokens, and other edge cases.

---

## Installation & Setup

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v14+)
- **MongoDB**
- **npm or yarn**

### Environment Variables

Create a `.env` file in the root directory and add the following:

```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret_key>
NEWS_API_KEY=<your_newsapi_api_key>
```

### Install Dependencies

```sh
npm install
```

### Start the Server

```sh
npm start
```

### Run Tests

```sh
npm test
```

---

## API Endpoints

### **Authentication** (`/users`)

| Method | Endpoint  | Description |
|--------|----------|-------------|
| POST   | `/signup` | Register a new user |
| POST   | `/login`  | Authenticate user and get JWT token |

### **Preferences**

| Method | Endpoint        | Description |
|--------|----------------|-------------|
| GET    | `/preferences`  | Retrieve user preferences (requires JWT) |
| PUT    | `/preferences`  | Update user preferences (requires JWT) |

### **News** (`/news`)

| Method | Endpoint          | Description |
|--------|------------------|-------------|
| GET    | `/`              | Fetch news articles based on user preferences |
| POST   | `/:id/read`      | Mark news as read |
| POST   | `/:id/favourite` | Mark news as favorite |
| GET    | `/favourites`    | Get all favorite news |
| GET    | `/read`          | Get all read news |
| GET    | `/search/:query` | Search for news based on a keyword |

---

## Project Structure

```
news-aggregator-api/
├── controllers/
│   ├── usersController.js       # Handles user authentication and preferences
│   ├── newsController.js        # Handles news fetching and management
|── jobs/
|   |──Cronjobs.js               #refreshes the db everyhour
├── middlewares/
│   ├── authorization.js         # JWT-based authentication middleware
├── models/
│   ├── userModel.js             # MongoDB schema for users
│   ├── newsModel.js             # MongoDB schema for news caching
├── routes/
│   ├── usersRouter.js           # User-related API routes
│   ├── newsRouter.js            # News-related API routes
├── test/
│   ├── server.test.js           # Test cases for API endpoints
├── app.js                       # Main application file
├── server.js                    # Entry point for the server
├── README.md                    # Project documentation
```

---

## Background Jobs

### **Cron Job for Automatic News Fetching**

A cron job runs **every hour** to update the cached news:

```js
cron.schedule("0 * * * *", async () => {
    console.log("Cron job started: Fetching and caching news...");
    await getNews();
    console.log("Cron job completed: News updated.");
});
```

---

## Technologies Used

- **Node.js** (Runtime Environment)
- **Express.js** (Web Framework)
- **MongoDB & Mongoose** (Database & ODM)
- **JWT** (User Authentication)
- **Axios** (API Requests)
- **Zod** (Validation)
- **Node-Cron** (Scheduled Jobs)
- **Tap** (Testing Framework)

---

## Future Enhancements

- **Add User Roles & Permissions**
- **Optimize Database Queries**
- **Improve Error Handling & Logging**

---

## Author

Developed by **Shamadeep** 🚀


