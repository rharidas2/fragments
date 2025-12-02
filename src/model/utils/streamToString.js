// src/model/utils/streamToString.js

/**
 * Converts a readable stream into a string.
 * @param {ReadableStream} stream - The stream to convert.
 * @returns {Promise<string>} The contents of the stream as a string.
 */
export default async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}
