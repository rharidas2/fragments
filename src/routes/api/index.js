const express = require('express');
const logger = require('../../logger');

const router = express.Router();

// Support sending various Content-Types on the body up to 5MB in size
const rawBody = express.raw({
  inflate: true,
  limit: '5mb',
  type: () => true,
});

// Import the post handler first to avoid circular dependencies
const postFragment = require('./post');

// GET /v1/fragments - list fragments (with optional expand=1)
router.get('/fragments', require('./get'));

// POST /v1/fragments - create fragment  
router.post('/fragments', rawBody, postFragment);

// GET /v1/fragments/:id - get fragment data
router.get('/fragments/:id', require('./id'));

// GET /v1/fragments/:id/info - get fragment metadata
router.get('/fragments/:id/info', require('./id/info'));

// GET /v1/fragments/:id.html - convert markdown to HTML
router.get('/fragments/:id.html', require('./id/html'));

logger.debug('Fragment API routes configured');
module.exports = router;
