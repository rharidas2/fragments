// src/model/data/index.js

// Local DB functions for metadata (fragments info)
const {
  readFragment,
  writeFragment,
  listFragments,
} = require('./memory'); // or your local DB functions

// S3 functions for fragment data storage
const {
  writeFragmentData: s3WriteFragmentData,
  readFragmentData: s3ReadFragmentData,
  deleteFragment: s3DeleteFragmentData,
} = require('./aws/s3Client'); // adjust path if needed

// Export all functions used by Fragment class
module.exports = {
  readFragment,                 // metadata read
  writeFragment,                // metadata write
  listFragments,                // list fragment IDs or expanded data
  readFragmentData: s3ReadFragmentData,   // S3 data read
  writeFragmentData: s3WriteFragmentData, // S3 data write
  deleteFragment: s3DeleteFragmentData,   // S3 delete
};
