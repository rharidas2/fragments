// src/auth/index.js

// Make sure our env isn't configured for both AWS Cognito and HTTP Basic Auth
if (
  process.env.AWS_COGNITO_POOL_ID &&
  process.env.AWS_COGNITO_CLIENT_ID &&
  process.env.HTPASSWD_FILE
) {
  throw new Error(
    'env contains configuration for both AWS Cognito and HTTP Basic Auth. Only one is allowed.'
  );
}

// Prefer Amazon Cognito (production)
if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  const cognitoAuth = require('./cognito');
  module.exports.strategy = cognitoAuth.strategy;
  module.exports.authenticate = cognitoAuth.authenticate;
}
// Also allow for an .htpasswd file to be used, but not in production
else if (process.env.HTPASSWD_FILE && process.env.NODE_ENV !== 'production') {
  const basicAuth = require('./basic-auth');
  module.exports.strategy = basicAuth.strategy;
  module.exports.authenticate = basicAuth.authenticate;
}
// In all other cases, we need to stop now and fix our config
else {
  throw new Error('missing env vars: no authorization configuration found');
}
