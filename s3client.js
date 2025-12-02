/**
 * S3 specific config and objects. See:
 * https://www.npmjs.com/package/@aws-sdk/client-s3
 */
const { S3Client } = require('@aws-sdk/client-s3');
const logger = require('../../../logger');

/**
 * If AWS credentials are configured in the environment, use them.
 */
const getCredentials = () => {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    return {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    };
  }
};

/**
 * If an AWS S3 Endpoint is configured in the environment, use it.
 */
const getS3Endpoint = () => {
  if (process.env.AWS_S3_ENDPOINT_URL) {
    logger.debug({ endpoint: process.env.AWS_S3_ENDPOINT_URL }, 'Using alternate S3 endpoint');
    return process.env.AWS_S3_ENDPOINT_URL;
  }
};

/**
 * Configure and export a new s3Client to use for all API calls.
 */
module.exports = new S3Client({
  region: process.env.AWS_REGION,
  credentials: getCredentials(),
  endpoint: getS3Endpoint(),
  forcePathStyle: true,
});
