import mongoose from "mongoose";
import config from ".";

export async function connectDB(): Promise<void> {
  try {
    const conn = await mongoose.connect(config.database_url as string, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
}
