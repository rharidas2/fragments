const express = require('express');
const { authenticate } = require('../auth');
const { createSuccessResponse } = require('../response');
const router = express.Router();

// GET /v1/fragments
router.get('/', authenticate(), (req, res) => {
  res.status(200).json(createSuccessResponse({ fragments: [] }));
});

module.exports = router;
