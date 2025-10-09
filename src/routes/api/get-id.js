const { Fragment } = require('../../model/fragment');
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

/**
 * Get a fragment by ID
 */
module.exports = async (req, res) => {
  const { id } = req.params;
  logger.debug({ fragmentId: id, user: req.user }, 'GET /fragments/:id request received');

  try {
    const fragment = await Fragment.byId(req.user, id);
    
    if (!fragment) {
      logger.warn({ fragmentId: id, user: req.user }, 'Fragment not found');
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }

    logger.info({ fragmentId: id, user: req.user }, 'Fragment retrieved successfully');
    return res.status(200).json(createSuccessResponse({ fragment }));
  } catch (err) {
    if (err.message.includes('not found')) {
      logger.warn({ fragmentId: id, user: req.user }, 'Fragment not found');
      return res.status(404).json(createErrorResponse(404, 'Fragment not found'));
    }
    
    logger.error({ err, fragmentId: id, user: req.user }, 'Error retrieving fragment');
    return res.status(500).json(createErrorResponse(500, 'Internal server error'));
  }
};
