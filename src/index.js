// src/index.js

// Load environment variables
require('dotenv').config();

// Logger setup
const logger = require('./logger'); // make sure logger.js exists in src/

// Handle crashes
process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'uncaughtException');
  throw err;
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'unhandledRejection');
  throw reason;
});

// Express setup
const express = require('express');
const app = express();

// Example route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

const unneededVariable = 'This variable is never used';
