import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '../src/models/User.js';

let mongoServer;

async function setupTestDB() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Create test data
  await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });

  console.log('Test database setup completed');
  await mongoose.connection.close();
  await mongoServer.stop();
}

setupTestDB().catch(console.error);