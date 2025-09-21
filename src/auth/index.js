let strategyModule;

if (process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID) {
  // Use Cognito if env vars are defined
  strategyModule = require('./cognito');
} else {
  // Fallback to Basic Auth for testing/dev
  strategyModule = require('./basic-auth');
}

module.exports.strategy = strategyModule.strategy;
module.exports.authenticate = strategyModule.authenticate;
