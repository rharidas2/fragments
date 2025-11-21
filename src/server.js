// src/server.js
const app = require('./app');
const logger = require('./logger');
const stoppable = require('stoppable');

const port = parseInt(process.env.PORT || 8080, 10);

// Listen on all network interfaces
const server = stoppable(
  app.listen(port, '0.0.0.0', () => {
    logger.info(`Server started on port ${port}`);
  })
);

module.exports = server;
