// jest.config.js

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'env.jest') });

console.log(`Using LOG_LEVEL=${process.env.LOG_LEVEL}`);

module.exports = {
  verbose: true,
  testTimeout: 5000,
  testPathIgnorePatterns: [
    "/node_modules/",
    "/.vscode/"
  ],
};
