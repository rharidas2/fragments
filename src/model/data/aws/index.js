// src/model/data/index.js

// Keep MemoryDB for fragment metadata
const MemoryDB = require('./memory/memory-db');
const metadata = new MemoryDB();

const logger = require('../../logger');

// Import the S3 client we just created
const { s3Client } = require('./aws/s3Client'); // adjust path if needed
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');

// Use your bucket name
const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'rohith-fragments-s3';

/**
 * Metadata functions (MemoryDB)
 */
function writeFragment(fragment) {
  logger.debug({ fragmentId: fragment.id, ownerId: fragment.ownerId }, 'Writing fragment metadata');
  const serialized = JSON.stringify(fragment);
  return metadata.put(fragment.ownerId, fragment.id, serialized);
}

async function readFragment(ownerId, id) {
  const serialized = await metadata.get(ownerId, id);
  return serialized ? JSON.parse(serialized) : null;
}

async function listFragments(ownerId, expand = false) {
  const fragments = await metadata.query(ownerId) || [];
  if (expand) return fragments.map(f => (typeof f === 'string' ? JSON.parse(f) : f));
  return fragments.map(f => (typeof f === 'string' ? JSON.parse(f).id : f.id));
}

async function deleteFragmentMetadata(ownerId, id) {
  await metadata.del(ownerId, id);
}

/**
 * Data functions (S3)
 */
async function writeFragmentData(ownerId, id, buffer) {
  const key = `${ownerId}/${id}`;
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer
  }));
  logger.debug({ fragmentId: id, ownerId, size: buffer.length }, 'Fragment data written to S3');
}

async function readFragmentData(ownerId, id) {
  const key = `${ownerId}/${id}`;
  const response = await s3Client.send(new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  }));
  const chunks = [];
  for await (let chunk of response.Body) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function deleteFragmentData(ownerId, id) {
  const key = `${ownerId}/${id}`;
  await s3Client.send(new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  }));
  logger.debug({ fragmentId: id, ownerId }, 'Fragment data deleted from S3');
}

module.exports = {
  writeFragment,
  readFragment,
  listFragments,
  deleteFragmentMetadata,
  writeFragmentData,
  readFragmentData,
  deleteFragmentData
};
