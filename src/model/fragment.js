// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const logger = require('../logger'); // Fix path - should be '../logger'

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (!ownerId || !type) {
      logger.error('Fragment creation failed: ownerId and type are required');
      throw new Error('ownerId and type are required');
    }

    // Parse the type to validate it
    let parsedType;
    try {
      parsedType = contentType.parse(type);
    } catch (err) {
      logger.error({ err, type }, 'Fragment creation failed: invalid Content-Type');
      throw new Error(`Invalid Content-Type: ${type}`);
    }

    // Check if the base type (without charset) is supported
    if (!Fragment.isSupportedType(parsedType.type)) {
      logger.warn({ type }, 'Fragment creation failed: unsupported type');
      throw new Error(`Type ${type} is not supported`);
    }

    if (typeof size !== 'number' || size < 0) {
      logger.error({ size }, 'Fragment creation failed: invalid size');
      throw new Error('Size must be a non-negative number');
    }

    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
    
    logger.debug({ fragmentId: this.id, ownerId, type }, 'Fragment instance created');
  }

  static async byUser(ownerId, expand = false) {
    logger.debug({ ownerId, expand }, 'Fetching fragments for user');
    
    try {
      const fragmentIds = await listFragments(ownerId, expand);
      
      if (expand) {
        logger.debug({ ownerId, count: fragmentIds.length }, 'Returning expanded fragments');
        return fragmentIds.map(fragmentData => new Fragment(fragmentData));
      } else {
        logger.debug({ ownerId, count: fragmentIds.length }, 'Returning fragment IDs');
        return fragmentIds;
      }
    } catch (err) {
      logger.error({ err, ownerId }, 'Error fetching fragments for user');
      throw err;
    }
  }

  static async byId(ownerId, id) {
    logger.debug({ ownerId, id }, 'Fetching fragment by ID');
    
    try {
      const fragmentData = await readFragment(ownerId, id);
      if (!fragmentData) {
        logger.warn({ ownerId, id }, 'Fragment not found');
        throw new Error(`Fragment not found for ownerId: ${ownerId}, id: ${id}`);
      }
      
      logger.debug({ ownerId, id }, 'Fragment found and returned');
      return new Fragment(fragmentData);
    } catch (err) {
      logger.error({ err, ownerId, id }, 'Error fetching fragment by ID');
      throw err;
    }
  }

  static delete(ownerId, id) {
    logger.debug({ ownerId, id }, 'Deleting fragment');
    return deleteFragment(ownerId, id);
  }

  save() {
    logger.debug({ fragmentId: this.id }, 'Saving fragment metadata');
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  getData() {
    logger.debug({ fragmentId: this.id }, 'Fetching fragment data');
    return readFragmentData(this.ownerId, this.id);
  }

  async setData(data) {
    if (!Buffer.isBuffer(data)) {
      logger.error({ fragmentId: this.id }, 'setData failed: data must be a Buffer');
      throw new Error('Data must be a Buffer');
    }
    
    logger.debug({ fragmentId: this.id, size: data.length }, 'Setting fragment data');
    
    this.size = data.length;
    this.updated = new Date().toISOString();
    
    try {
      await writeFragmentData(this.ownerId, this.id, data);
      await this.save();
      logger.debug({ fragmentId: this.id, size: this.size }, 'Fragment data saved successfully');
    } catch (err) {
      logger.error({ err, fragmentId: this.id }, 'Error setting fragment data');
      throw err;
    }
  }

  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  get isText() {
    return this.mimeType.startsWith('text/');
  }

  get formats() {
    return ['text/plain'];
  }

  static isSupportedType(value) {
    try {
      const { type } = contentType.parse(value);
      const supported = type === 'text/plain';
      logger.debug({ value, supported }, 'Type support check');
      return supported;
    } catch (err) {
      logger.debug({ value, err: err.message }, 'Type support check failed');
      return false;
    }
  }
}

module.exports.Fragment = Fragment;
