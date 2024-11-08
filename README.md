# PassportJS-NodeJS

A Node.js application demonstrating **Passport.js** authentication strategies for integrating **Google** and **Facebook** login.

This project allows users to authenticate using their Google or Facebook accounts, providing a seamless way to log into your app via OAuth2 authentication.

## Features
- **Google Authentication**: Users can authenticate using their Google account with OAuth2.
- **Facebook Authentication**: Users can log in using their Facebook account.
- **MongoDB Integration**: User information is saved and retrieved from a MongoDB database for session persistence.
- **Session Management**: User sessions are managed using Passport.js and stored in the server-side session.

## Tech Stack
- **Node.js**: JavaScript runtime used to build the backend server.
- **Express.js**: Web framework for Node.js used to handle routing.
- **Passport.js**: Middleware used for handling authentication.
- **MongoDB**: NoSQL database used for storing user information.
- **dotenv**: For environment variable management.
- **Google OAuth2 & Facebook OAuth**: Authentication strategies used for Google and Facebook login.

## Installation

1. Clone this repository:
    ```bash
    git clone https://github.com/AmanSalman/PassportJS-NodeJS.git
    ```

2. Install dependencies:
    ```bash
    cd PassportJS-NodeJS
    npm install
    ```

3. Create a `.env` file in the root directory and add the following environment variables:

    ```env
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

    FACEBOOK_CLIENT_ID=your-facebook-client-id
    FACEBOOK_CLIENT_SECRET=your-facebook-client-secret
    FACEBOOK_CALLBACK_URL=http://localhost:3000/auth/facebook/callback

    SESSION_SECRET = your-secret-session
    ```

4. Run the application:
    ```bash
    npm start
    ```

    The app will be running at `http://localhost:3000`.

## Routes
- **GET /auth/google**: Redirects to Google OAuth2 authentication.
- **GET /auth/google/callback**: Handles the OAuth2 callback from Google.
- **GET /auth/facebook**: Redirects to Facebook OAuth authentication.
- **GET /auth/facebook/callback**: Handles the OAuth callback from Facebook.
- **GET /auth/google/success**: Displays the authenticated user's data after successful Google login.
- **GET /auth/facebook/success**: Displays the authenticated user's data after successful Facebook login.
- **GET /auth/error**: Shows an error page if authentication fails.

## Example Usage

Once the server is running, visit the following links in your browser:

- [Authenticate with Google](http://localhost:3000/auth/google)
- [Authenticate with Facebook](http://localhost:3000/auth/facebook)

These links will initiate the OAuth flow and allow you to authenticate using your Google or Facebook account.


