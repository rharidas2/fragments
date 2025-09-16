// src/routes/api/index.js
const express = require('express');
const router = express.Router();

// Mount our individual API routes
router.use('/fragments', require('./get'));

module.exports = router;
