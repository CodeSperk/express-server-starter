import mongoose from 'mongoose';
import config from '.';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  mongoose.set('strictQuery', true);
  mongoose.set('autoIndex', config.node_env !== 'production');

  await mongoose.connect(config.database_url);
  isConnected = true;

  console.info('MongoDB connected');
}
