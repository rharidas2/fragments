const express = require('express');
const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

const router = express.Router();

// Support sending various Content-Types on the body up to 5MB in size
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      try {
        const { type } = contentType.parse(req);
        const supported = Fragment.isSupportedType(type);
        logger.debug({ type, supported }, 'Raw body parser type check');
        return supported;
      } catch (err) {
        logger.debug({ err: err.message }, 'Raw body parser type check failed');
        return false;
      }
    },
  });

// GET /v1/fragments (list)
router.get('/', require('./get'));

// POST /v1/fragments (create)
router.post('/', rawBody(), require('./post'));

// GET /v1/fragments/:id (get by ID)
router.get('/:id', require('./get-id'));

logger.debug('Fragment API routes configured');
module.exports = router;
