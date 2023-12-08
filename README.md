## Getting Started

To get started, follow these steps:

1. Clone the repository to your local machine.
2. Run npm install to install the project dependencies:
```bash
npm install
```
3. Create a .env file and fill in the necessary environment variables.
4. Run npm start to start the server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

The website includes the following features:

- Authentication for users of credentials
- Visitor login
- Log in with Google
- View posts from user and friends in a feed
- Create a post with or without an image
- View and make comments
- Like a post
- Change name and profile picture url on profile page
- Responsive design supported by Bootstrap

## Pages

The website includes the following pages:

- /: The login/signup page, which displays authentication forms
- /home: The homepage displaying your home feed
- /friends: Displays list of user's friends and friend requests
- /all: Displays a list of all posts
- /profile: Displays the profile page of the user and the user's posts
- /search/:filter: Displays a list of users given user search
- /users/:userId: Displays the user's profile and their posts

## API Endpoints

The API has the following endpoints:

POST api/auth/general-visitor-login: Logs in as a visitor.
POST api/auth/google-login: Logs in using the user's Google account.
POST api/auth/login: Logs in the user given the credentials.
POST api/auth/signup: Creates a new user given the credentials.

POST api/friend-requests: Authenticated user sends a new friend request.
POST api/friend-requests/:userId/accept: Accept a friend request from userId.
DELETE api/friend-requests/:userId/cancel: Cancel a friend request to userId.
POST api/friend-requests/:userId/decline: Decline a friend request from userId.

GET api/images/:imageId: Get an image with imageId.

POST api/posts: Authenticated user creates a new post.
GET api/posts: Get all posts.
DELETE api/posts/:postId: Delete the post with postId.
POST api/posts/:postId/comments: Create a comment on a post.
POST api/posts/:postId/likes: Give a like to a post.
DELETE api/posts/:postId/likes/:likeId: Delete a like.

PUT api/profile: Update authenticated user's profile.

GET api/users/:userId: Get information about user with userId.
GET api/users/:userId/feed-posts: Get a user's feed.
GET api/users/:userId/posts: Get a user's posts.
GET api/users/:userId/unfriend: Unfriend a user with userId.

## Dependencies
The following dependencies are used in this project:

1. Next: Framework for both frontend and backend development.
2. Mongoose: Object modeling tool for MongoDB.
3. dotenv: Loads environment variables from a .env file.
4. Next-auth: Framework for user authentication.
5. bcryptjs: Used for password hashing.
6. zod: Validation library for forms.
7. luxon: DateTime helper library.

Environment Variables
The following environment variables are used in this project:

1. GOOGLE_ID: Used for Google's authorization servers for setting up OAuth.
2. GOOGLE_CLIENT_SECRET: Used for authenticating identity of the application to Google's authorization servers.
3. MONGODB_URI: The URI for the MongoDB database.
4. NEXTAUTH_URL: Set to the canonical URL of the website (http://localhost:3000 if developing)
5. NEXTAUTH_SECRET: Used to encrypt the NextAuth JWT.