// src/model/data/memory/fragment-db.js
const MemoryDB = require('./memory-db');
const logger = require('../../../logger');

class FragmentDB {
  constructor() {
    this.db = new MemoryDB();
  }

  // Write a fragment to the database
  async writeFragment(fragment) {
    if (!fragment || !fragment.ownerId || !fragment.id) {
      throw new Error('Fragment must have ownerId and id');
    }
    
    const serialized = JSON.stringify(fragment);
    await this.db.put(fragment.ownerId, fragment.id, serialized);
    logger.debug({ fragmentId: fragment.id, ownerId: fragment.ownerId }, 'Writing fragment metadata');
  }

  // Read a fragment from the database
  async readFragment(ownerId, id) {
    const serialized = await this.db.get(ownerId, id);
    if (!serialized) {
      return undefined;
    }
    return JSON.parse(serialized);
  }

  // List fragments for a user
  async listFragments(ownerId, expand = false) {
    const fragments = await this.db.query(ownerId);
    
    if (expand) {
      // Return full fragment objects
      return fragments.map(f => typeof f === 'string' ? JSON.parse(f) : f);
    } else {
      // Return only fragment IDs
      return fragments.map(f => {
        const fragment = typeof f === 'string' ? JSON.parse(f) : f;
        return fragment.id;
      });
    }
  }

  // Delete a fragment from the database
  async deleteFragment(ownerId, id) {
    await this.db.del(ownerId, id);
    logger.debug({ fragmentId: id, ownerId }, 'Deleting fragment metadata');
  }
}

module.exports = FragmentDB;
