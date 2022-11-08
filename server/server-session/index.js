const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { v4: uuidv4} = require('uuid');
const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3001;

const router = require('./router');

const corsConfig = {
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.json());
app.use(session({
  genid: (req) => {
    return uuidv4();
  },
  name: 'sid',
  secret: 'YYtZOalROBNezpMXZkbDMpqWqadsgCnOpDGWnCmInmAZrDfNcS',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    sameSite: 'strict',
    secure: false,
  }
}));

app.use(router);
app.get('*', (req, res) => {
  res.status(404).send('Sorry, not found 😞');
});

const server = app.listen(SERVER_PORT, (err) => {
  if (err) {
    console.log(`😞 Sorry, something went wrong! ${err}`); // eslint-disable-line no-console
  } else {
    console.log(`🚀 Server (sessions) is listening on port ${SERVER_PORT}!`); // eslint-disable-line no-console
  }
});

// server needs to be exported for the tests to work
module.exports = server;
