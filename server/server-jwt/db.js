const mongoose = require('mongoose');
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || 'jwt_db';

mongoose.connect(
  // `mongodb://127.0.0.1:${DB_PORT}/${DB_NAME}`,
  'mongodb+srv://Gustavo_Silva:sessionsAndCookiesClass@firsttry.dpuwp.mongodb.net/authenticate?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(`😞 Sorry, something went wrong! ${err}`); // eslint-disable-line no-console
    } else {
      console.log(`🦆 Database (JWT) connected @ port ${DB_PORT}!`); // eslint-disable-line no-console
    }
  }
);

module.exports = mongoose;
