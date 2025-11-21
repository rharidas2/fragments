
const { Fragment } = require('../../../model/fragment');
const logger = require('../../../logger');

/**
 * GET /v1/fragments/:id/info
 * Get a fragment's metadata by ID for the current user
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    
    res.status(200).json({
      status: 'ok',
      fragment: fragment,
    });
  } catch (err) {
    logger.error({ err, user: req.user, fragmentId: req.params.id }, 'Error getting fragment info');
    
    if (err.message.includes('not found')) {
      res.status(404).json({ error: 'Fragment not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

