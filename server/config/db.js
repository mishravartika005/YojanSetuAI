import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  if (!env.mongoUri) {
    throw new Error('MONGODB_URI is not configured.');
  }

  try {
    await mongoose.connect(env.mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}