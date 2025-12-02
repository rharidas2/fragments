// src/model/data/aws/index.js
const s3Client = require('./s3Client');
const ddbDocClient = require('./ddbDocClient');
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { PutCommand, GetCommand, QueryCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const logger = require('../../../logger');

// Convert stream to Buffer
const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

// Write fragment metadata to DynamoDB
function writeFragment(fragment) {
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Item: fragment,
  };

  const command = new PutCommand(params);

  try {
    return ddbDocClient.send(command);
  } catch (err) {
    logger.warn({ err, params, fragment }, 'error writing fragment to DynamoDB');
    throw err;
  }
}

// Read fragment metadata from DynamoDB
async function readFragment(ownerId, id) {
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Key: { ownerId, id },
  };

  const command = new GetCommand(params);

  try {
    const data = await ddbDocClient.send(command);
    return data?.Item;
  } catch (err) {
    logger.warn({ err, params }, 'error reading fragment from DynamoDB');
    throw err;
  }
}

// List fragments from DynamoDB
async function listFragments(ownerId, expand = false) {
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    KeyConditionExpression: 'ownerId = :ownerId',
    ExpressionAttributeValues: {
      ':ownerId': ownerId,
    },
  };

  if (!expand) {
    params.ProjectionExpression = 'id';
  }

  const command = new QueryCommand(params);

  try {
    const data = await ddbDocClient.send(command);
    return !expand ? data?.Items.map((item) => item.id) : data?.Items;
  } catch (err) {
    logger.error({ err, params }, 'error getting all fragments for user from DynamoDB');
    throw err;
  }
}

// Write fragment data to S3
async function writeFragmentData(ownerId, id, data) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
    Body: data,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3Client.send(command);
    logger.debug({ ownerId, id, size: data.length }, 'Fragment data written to S3');
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error uploading fragment data to S3');
    throw new Error('unable to upload fragment data');
  }
}

// Read fragment data from S3
async function readFragmentData(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  const command = new GetObjectCommand(params);

  try {
    const data = await s3Client.send(command);
    const buffer = await streamToBuffer(data.Body);
    logger.debug({ ownerId, id, size: buffer.length }, 'Fragment data read from S3');
    return buffer;
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error streaming fragment data from S3');
    throw new Error('unable to read fragment data');
  }
}

// Delete fragment (metadata from DynamoDB and data from S3)
async function deleteFragment(ownerId, id) {
  try {
    // Delete metadata from DynamoDB
    const ddbParams = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      Key: { ownerId, id },
    };
    const ddbCommand = new DeleteCommand(ddbParams);
    await ddbDocClient.send(ddbCommand);
    logger.debug({ ownerId, id }, 'Fragment metadata deleted from DynamoDB');

    // Delete data from S3
    const s3Params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${ownerId}/${id}`,
    };
    const s3Command = new DeleteObjectCommand(s3Params);
    await s3Client.send(s3Command);
    logger.debug({ ownerId, id }, 'Fragment data deleted from S3');
    
  } catch (err) {
    logger.error({ err, ownerId, id }, 'Error deleting fragment from DynamoDB and S3');
    throw new Error('unable to delete fragment');
  }
}

module.exports = {
  writeFragment,
  readFragment,
  listFragments,
  deleteFragment,
  writeFragmentData,
  readFragmentData,
};
