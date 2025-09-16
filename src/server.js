// src/server.js
const app = require('./app');
const logger = require('./logger');
const stoppable = require('stoppable');

// Get the port from the environment
const port = parseInt(process.env.PORT || 8080, 10);

// Create a stoppable HTTP server for graceful shutdowns
const server = stoppable(
  app.listen(port, () => {
    logger.info(`Server started on port ${port}`);
  })
);

// Export the server for testing
module.exports = server;
