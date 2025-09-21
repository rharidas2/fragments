const passport = require('passport');
const HttpAuth = require('http-auth');
const HttpAuthPassport = require('http-auth-passport');
const path = require('path');
const logger = require('../logger');

// Path to your .htpasswd file
const htpasswdPath = path.join(__dirname, '../../tests/.htpasswd');

// Create Basic Auth backend
const basic = HttpAuth.basic({
  file: htpasswdPath,
});

module.exports.strategy = () => new HttpAuthPassport(basic);

module.exports.authenticate = () =>
  passport.authenticate('basic', { session: false });
