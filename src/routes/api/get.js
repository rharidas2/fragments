
const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

/**
 * GET /v1/fragments
 * Get a list of fragments for the current user
 * Optional query param: expand=1 to get full fragment metadata
 */
module.exports = async (req, res) => {
  try {
    const expand = req.query.expand === '1';
    
    logger.debug({ user: req.user, expand }, 'Getting fragments for user');
    
    const fragments = await Fragment.byUser(req.user, expand);
    
    res.status(200).json({
      status: 'ok',
      fragments: fragments,
    });
  } catch (err) {
    logger.error({ err, user: req.user }, 'Error getting fragments');
    res.status(500).json({ error: 'Internal server error' });
  }
};

