# Auth It 🔐

Today we’ll practice how to add an auth layer to an app. First we’ll use a stateful approach, with sessions, and then switch to a stateless method, using JSON Web Tokens (aka JWT).

![Authenticate it (sessions) login page](docs-assets/auth-it-ses.jpg)

## Learning objectives

While you are going through the exercise, keep in mind the following learning objectives. If by the end you don’t feel you have accomplished these objectives, please reach out to an instructor or TA.

1. What is authentication, how it works, and basic security concerns.
2. How “session” and “JWT” auth protocols are implemented end-to-end.
3. What is the difference between authentication and authorization.
4. How to structure your app to allow different authorization levels.

For an in-depth refresher you can [check out this video](https://www.youtube.com/watch?v=2PPSXonhIck).

## Getting started

Most of the client and server logic is already set up for you. 🚀

### Sessions 🍪

1. Have [MongoDB](https://docs.mongodb.com/manual/administration/install-community/) installed, and running at the default port.
2. Run `npm i` from the `server/server-session` and `client/client-session` folders.
3. Install [Nodemon](https://github.com/remy/nodemon) as a global dependency to easily monitor your file changes.
4. From the `server/server-session` directory, run the `nodemon index.js` to start your backend server.
5. From the `client/client-session` directory, run the `npm start` command to start the client

You can implement sessions manually, but we recommend using the [express-session](https://github.com/expressjs/session) library for this exercise.
For testing purposes, please name your session `sid`.

⚠️ Remember to hash your passwords before saving them to the database (e.g. with [bcrypt](https://github.com/kelektiv/node.bcrypt.js)).

### JWT 🔖

1. Before continuing, first stop the Node processes running from the “sessions” part.
2. Run `npm i` from the `server/server-jwt` and `client/client-jwt` folders.

If you want a recap of how JWT works, [check out these docs](https://jwt.io/).

You’ll notice a lot of code you implemented in the “session” part can be reused here. In what areas will you have to approach things differently? 🤔
For testing purposes, send the token to the client using a property `req.body.accessToken`.

## Tasks

These requirements apply to both session and JWT auth.

For each feature, it’s probably a good idea to start working on the server first, using [Postman](https://www.postman.com/downloads/) to simulate client requests and debug any problems. Once you have that feature properly implemented on the server, add the corresponding necessary code to the client.

1. A user should be able to register with email, password, first name and last name.
2. If the email already exists, the client should alert the user and prompt them to try to register again. There should also be a similar alert if the user tries to sign in with an incorrect email or password.
3. Upon successfully registering or logging in, the user should be redirected to the profile page. Logging out should destroy the session or remove the JWT and redirect the user to the homepage.
4. The `/me` and `/logout` routes should be protected by an auth middleware: unauthenticated requests should not be able to query these endpoints.

You can run `npm test` from the root directory to run tests on both the session and the jwt servers.

## Extra credits

### Sessions

By default `express-session` saves all session data only in memory. This is fine for a dev environment, but applications in production should persist session data. Try to refactor your server using a [session store](https://github.com/expressjs/session#compatible-session-stores). 🥞

### JWT

Production implementations of JWT will also use [refresh tokens](https://auth0.com/blog/refresh-tokens-what-are-they-and-when-to-use-them/) along with access tokens. Refactor your app to use refresh tokens, too.

### OAuth

Try implementing [OAuth 2.0](https://www.varonis.com/blog/what-is-oauth/) with any provider (e.g. Google, Facebook, GitHub, or LinkedIn) for this exercise. You can use [Passport.js](http://www.passportjs.org/) to make things a little simpler (the official docs can be unhelpfully cryptic at times, so you can check [these docs](https://github.com/jwalton/passport-api-docs) for reference).
