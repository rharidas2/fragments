const contentType = require('content-type');
const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

/**
 * Create a new fragment
 */
module.exports = async (req, res) => {
  // Check if user is authenticated
  if (!req.user) {
    logger.warn('Unauthenticated request to POST /fragments');
    return res.status(401).json({
      status: 'error',
      error: {
        message: 'Authentication required',
        code: 401,
      },
    });
  }

  try {
    // Parse content type
    let parsedType;
    try {
      parsedType = contentType.parse(req);
    } catch (err) {
      logger.warn({ err }, 'Invalid Content-Type header');
      return res.status(415).json(createErrorResponse(415, 'Invalid Content-Type'));
    }

    const type = parsedType.type;

    // Check if type is supported
    if (!Fragment.isSupportedType(type)) {
      logger.warn({ type }, 'Unsupported content type');
      return res.status(415).json(createErrorResponse(415, `Unsupported type: ${type}`));
    }

    // Check if body was parsed as a Buffer by the raw body parser
    if (!Buffer.isBuffer(req.body)) {
      logger.warn('Request body is not a Buffer');
      return res.status(415).json(createErrorResponse(415, 'Body must be binary data'));
    }

    // Create new fragment - use the full type from the header including charset
    const fragment = new Fragment({
      ownerId: req.user,
      type: req.headers['content-type'], // Use the full header value including charset
      size: req.body.length,
    });

    // Save fragment metadata and data
    await fragment.save();
    await fragment.setData(req.body);

    logger.info({ fragmentId: fragment.id, type: fragment.type, size: fragment.size }, 'Fragment created');

    // Set Location header
    const apiUrl = process.env.API_URL || `http://${req.headers.host}`;
    const location = new URL(`/v1/fragments/${fragment.id}`, apiUrl).toString();

    res.setHeader('Location', location);
    
    return res.status(201).json(createSuccessResponse({
      fragment: fragment,
    }));
  } catch (err) {
    logger.error({ err }, 'Error creating fragment');
    return res.status(500).json(createErrorResponse(500, 'Internal server error'));
  }
};
