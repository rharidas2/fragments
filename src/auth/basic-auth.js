const auth = require('http-auth');
const passport = require('passport');
const authPassport = require('http-auth-passport');

const logger = require('../logger');

// We'll use our authorize middleware module
const authorize = require('./auth-middleware');

// We expect HTPASSWD_FILE to be defined.
if (!process.env.HTPASSWD_FILE) {
  throw new Error('missing expected env var: HTPASSWD_FILE');
}

// Log that we're using Basic Auth
logger.info('Using HTTP Basic Auth for auth');

// Create the strategy
const strategy = authPassport(
  auth.basic({
    file: process.env.HTPASSWD_FILE,
  })
);

passport.use('http', strategy);

module.exports.strategy = () => strategy;

// Previously we defined `authenticate()` like this:
// module.exports.authenticate = () => passport.authenticate('http', { session: false });
//
// Now we'll delegate the authorization to our authorize middleware
module.exports.authenticate = () => authorize('http');
