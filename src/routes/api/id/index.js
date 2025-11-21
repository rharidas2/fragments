
const { Fragment } = require('../../../model/fragment');
const logger = require('../../../logger');

/**
 * GET /v1/fragments/:id
 * Get a fragment's data by ID for the current user
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    const data = await fragment.getData();
    
    // Set the correct Content-Type header
    res.set('Content-Type', fragment.type);
    
    // Return the fragment data
    res.status(200).send(data);
  } catch (err) {
    logger.error({ err, user: req.user, fragmentId: req.params.id }, 'Error getting fragment data');
    
    if (err.message.includes('not found')) {
      res.status(404).json({ error: 'Fragment not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

