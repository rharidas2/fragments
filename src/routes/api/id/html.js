
const { Fragment } = require('../../../model/fragment');
const MarkdownIt = require('markdown-it');
const logger = require('../../../logger');

const md = new MarkdownIt();

/**
 * GET /v1/fragments/:id.html
 * Convert a markdown fragment to HTML
 */
module.exports = async (req, res) => {
  try {
    const fragment = await Fragment.byId(req.user, req.params.id);
    
    // Check if the fragment is markdown
    if (fragment.type !== 'text/markdown') {
      return res.status(415).json({ 
        error: 'Unsupported conversion - only markdown fragments can be converted to HTML' 
      });
    }
    
    const data = await fragment.getData();
    const html = md.render(data.toString());
    
    // Set Content-Type to HTML
    res.set('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (err) {
    logger.error({ err, user: req.user, fragmentId: req.params.id }, 'Error converting fragment to HTML');
    
    if (err.message.includes('not found')) {
      res.status(404).json({ error: 'Fragment not found' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

