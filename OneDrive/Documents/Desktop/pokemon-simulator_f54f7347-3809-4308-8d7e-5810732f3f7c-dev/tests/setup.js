require('dotenv').config();
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cache = require('../src/utils/cache');


process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.SESSION_SECRET || 'testsecret';
process.env.POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

let mongo;

beforeAll(async () => {
  try {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
  } catch (error) {
    console.error('*** Test database connection failed:', error.message, '***');
    process.env.DATABASE_URL = 'mongodb://localhost:27017/pokemon-battle-simulator-test';
    process.env.MONGODB_URI = 'mongodb://localhost:27017/pokemon-battle-simulator-test';
  }
}, 60000);

beforeEach(async () => {
  cache.clear();
});

afterAll(async () => {
  try {
    if (mongo) {
      await mongo.stop();
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  } catch (error) {
    console.error('*** Test database disconnection failed:', error.message, '***');
  }
}, 30000);
