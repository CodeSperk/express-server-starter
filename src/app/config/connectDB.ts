import mongoose from 'mongoose';
import config from '.';

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(config.database_url as string, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed', error);
    process.exit(1);
  }
}
