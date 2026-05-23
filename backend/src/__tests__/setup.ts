import mongoose from 'mongoose';
import { Express } from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { resetEnvCache } from '../config/env';
import { createApp } from '../app';

let mongo: MongoMemoryServer;
let testApp: Express;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = mongo.getUri();
  process.env.JWT_SECRET = 'test-jwt-secret-min-16-chars';
  process.env.JWT_EXPIRES_IN = '1d';
  process.env.FRONTEND_URL = 'http://localhost:5173';
  process.env.ALLOW_ADMIN_REGISTER = 'false';
  resetEnvCache();
  await mongoose.connect(process.env.MONGODB_URI);
  testApp = createApp();
});

export const getTestApp = () => testApp;

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
  resetEnvCache();
});
