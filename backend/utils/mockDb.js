/**
 * Lightweight file-based database for development when MongoDB is not available.
 * Stores data in JSON files in the backend/data/ directory.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class MockCollection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    this.data = this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      }
    } catch (e) {
      console.log(`Creating new collection: ${this.name}`);
    }
    return [];
  }

  _save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
  }

  _generateId() {
    return crypto.randomBytes(12).toString('hex');
  }

  find(query = {}) {
    let results = [...this.data];
    for (const key of Object.keys(query)) {
      if (key === '$or') continue;
      if (key === '_id' && typeof query[key] === 'object') {
        // Handle _id with $in etc.
        if (query[key].$in) {
          results = results.filter(item => query[key].$in.includes(item._id));
        }
        continue;
      }
      results = results.filter(item => item[key] === query[key] || 
        (typeof item[key] === 'object' && item[key]?.toString() === query[key]?.toString()));
    }
    return results;
  }

  findOne(query = {}) {
    const results = this.find(query);
    return results.length > 0 ? results[0] : null;
  }

  findById(id) {
    return this.data.find(item => item._id === id || item._id?.toString() === id) || null;
  }

  insertOne(doc) {
    const newDoc = { _id: this._generateId(), ...doc, createdAt: new Date().toISOString() };
    this.data.push(newDoc);
    this._save();
    return newDoc;
  }

  insertMany(docs) {
    const newDocs = docs.map(doc => ({ _id: this._generateId(), ...doc, createdAt: new Date().toISOString() }));
    this.data.push(...newDocs);
    this._save();
    return newDocs;
  }

  updateOne(query, update) {
    const index = this.data.findIndex(item => {
      for (const key of Object.keys(query)) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
    if (index !== -1) {
      if (update.$set) {
        Object.assign(this.data[index], update.$set);
      } else if (update.$inc) {
        for (const key of Object.keys(update.$inc)) {
          this.data[index][key] = (this.data[index][key] || 0) + update.$inc[key];
        }
      } else if (update.$push) {
        for (const key of Object.keys(update.$push)) {
          if (!this.data[index][key]) this.data[index][key] = [];
          this.data[index][key].push(update.$push[key]);
        }
      } else {
        Object.assign(this.data[index], update);
      }
      this.data[index].updatedAt = new Date().toISOString();
      this._save();
      return { modifiedCount: 1 };
    }
    return { modifiedCount: 0 };
  }

  findByIdAndUpdate(id, update, options = {}) {
    const index = this.data.findIndex(item => item._id === id);
    if (index !== -1) {
      if (update.$set) {
        Object.assign(this.data[index], update.$set);
      } else {
        Object.assign(this.data[index], update);
      }
      this.data[index].updatedAt = new Date().toISOString();
      this._save();
      return options.new ? this.data[index] : { modifiedCount: 1 };
    }
    return null;
  }

  findByIdAndDelete(id) {
    const index = this.data.findIndex(item => item._id === id);
    if (index !== -1) {
      const deleted = this.data.splice(index, 1)[0];
      this._save();
      return deleted;
    }
    return null;
  }

  deleteMany(query = {}) {
    const before = this.data.length;
    if (Object.keys(query).length === 0) {
      this.data = [];
    } else {
      this.data = this.data.filter(item => {
        for (const key of Object.keys(query)) {
          if (item[key] === query[key]) return false;
        }
        return true;
      });
    }
    this._save();
    return { deletedCount: before - this.data.length };
  }

  countDocuments(query = {}) {
    return this.find(query).length;
  }

  sort(field) {
    const dir = field.startsWith('-') ? -1 : 1;
    const key = field.replace(/^-/, '');
    this.data.sort((a, b) => {
      if (a[key] < b[key]) return -1 * dir;
      if (a[key] > b[key]) return 1 * dir;
      return 0;
    });
    return this;
  }

  limit(n) {
    this.data = this.data.slice(0, n);
    return this;
  }

  lean() {
    return JSON.parse(JSON.stringify(this.data));
  }

  aggregate(pipeline) {
    let results = [...this.data];
    for (const stage of pipeline) {
      if (stage.$match) {
        results = results.filter(item => {
          for (const key of Object.keys(stage.$match)) {
            if (item[key] !== stage.$match[key]) return false;
          }
          return true;
        });
      }
      if (stage.$group) {
        const grouped = {};
        for (const item of results) {
          const key = item[stage.$group._id?.$replaceWith || stage.$group._id] || 'null';
          if (!grouped[key]) grouped[key] = { _id: key, count: 0 };
          if (stage.$group.count) grouped[key].count += 1;
          if (stage.$group.sum) grouped[key].sum = (grouped[key].sum || 0) + (item[Object.keys(stage.$group.sum)[1]] || 0);
        }
        results = Object.values(grouped);
      }
    }
    return results;
  }

  populate() { return this; }
}

const collections = {};

function getCollection(name) {
  if (!collections[name]) {
    collections[name] = new MockCollection(name);
  }
  return collections[name];
}

module.exports = { getCollection, MockCollection };