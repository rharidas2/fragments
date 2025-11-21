const express = require('express');
const router = express.Router();
const { authenticate } = require('../auth');
const logger = require('../logger'); 

// All fragment routes require authentication
//router.use(authenticate());

// Import your API routes
router.use('/', require('./api'));

logger.debug('Fragment routes configured');
module.exports = router;
