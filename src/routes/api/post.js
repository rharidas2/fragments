const { Fragment } = require('../../model/fragment');
const logger = require('../../logger');

module.exports = async (req, res) => {
  // Get Content-Type and check if it's supported
  const contentType = req.get('Content-Type');
  
  // Check if Content-Type header exists
  if (!contentType) {
    return res.status(415).json({ 
      status: 'error',
      error: { 
        message: 'Content-Type header is required', 
        code: 415 
      }
    });
  }
  
  // Check if type is supported using Fragment's method
  const isSupported = Fragment.isSupportedType(contentType);
  
  if (!isSupported) {
    return res.status(415).json({ 
      status: 'error',
      error: { 
        message: 'Unsupported type', 
        code: 415 
      }
    });
  }

  try {
    // Create fragment
    const fragment = new Fragment({ 
      ownerId: req.user, 
      type: contentType 
    });
    
    await fragment.setData(req.body);
    await fragment.save();

    // Set Location header (REQUIRED for Assignment 2)
    res.set('Location', `${process.env.API_URL || 'http://localhost:8080'}/v1/fragments/${fragment.id}`);
    res.status(201).json({
      status: 'ok',
      fragment: fragment,
    });
  } catch (err) {
    logger.error({ err, contentType }, 'Error creating fragment');
    res.status(500).json({ 
      status: 'error',
      error: { 
        message: 'Internal server error', 
        code: 500 
      }
    });
  }
};
