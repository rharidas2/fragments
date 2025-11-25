import { s3Client } from './s3Client.js';
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import streamToString from '../../utils/streamToString.js'; // helper to convert stream to string

const BUCKET = process.env.AWS_BUCKET_NAME;

// Upload a fragment to S3
export async function writeFragmentData(fragmentId, data) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: fragmentId,
      Body: data,
    });
    await s3Client.send(command);
    return true;
  } catch (err) {
    console.error('Error uploading fragment:', err);
    throw err;
  }
}

// Read a fragment from S3
export async function readFragmentData(fragmentId) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET,
      Key: fragmentId,
    });
    const response = await s3Client.send(command);
    const bodyContents = await streamToString(response.Body);
    return bodyContents;
  } catch (err) {
    if (err.name === 'NoSuchKey') return null; // fragment does not exist
    console.error('Error reading fragment:', err);
    throw err;
  }
}

// Delete a fragment from S3
export async function deleteFragment(fragmentId) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: fragmentId,
    });
    await s3Client.send(command);
    return true;
  } catch (err) {
    console.error('Error deleting fragment:', err);
    throw err;
  }
}
