// src/model/fragment.js
const { randomUUID } = require('crypto');
const { writeFragment, readFragment, writeFragmentData, readFragmentData } = require('./data');
const logger = require('../logger');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId || !type) {
      throw new Error('ownerId and type are required');
    }

    if (typeof size !== 'number') {
      throw new Error('size must be a number');
    }

    if (size < 0) {
      throw new Error('size cannot be negative');
    }

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;

    // Validate type
    if (!Fragment.isSupportedType(type)) {
      throw new Error('Type not supported');
    }
  }

  /**
   * Get all supported mime types
   */
  static getSupportedTypes() {
    return [
      'text/plain',
      'text/markdown', 
      'text/html',
      'application/json',
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/gif',
    ];
  }

  /**
   * Check if a mime type is supported
   */
  static isSupportedType(type) {
    return this.getSupportedTypes().includes(type);
  }

  /**
   * Save this fragment to the database
   */
  async save() {
    this.updated = new Date().toISOString();
    await writeFragment(this);
  }

  /**
   * Get a fragment from the database by ownerId and id
   */
  static async byId(ownerId, id) {
    const data = await readFragment(ownerId, id);
    if (!data) {
      throw new Error('Fragment not found');
    }
    return new Fragment(data);
  }

  /**
   * Get fragments for an owner
   */
  static async byUser(ownerId, expand = false) {
    return readFragment(ownerId, undefined, expand);
  }

  /**
   * Delete the fragment
   */
  async delete() {
    // You'll need to implement this based on your data layer
    throw new Error('Not implemented');
  }

  /**
   * Get the fragment's data
   */
  async getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set the fragment's data
   */
  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      throw new Error('Data must be a Buffer');
    }
    this.size = data.length;
    this.updated = new Date().toISOString();
    await writeFragmentData(this.ownerId, this.id, data);
    await this.save();
  }
}

module.exports = { Fragment };
