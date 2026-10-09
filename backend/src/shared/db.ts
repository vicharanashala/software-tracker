import mongoose from 'mongoose';
import { config } from './config.js';

export function connectDb() {
  return mongoose.connect(config.mongoUri);
}

// transactions only work on a replica set, see docker-compose.yml
export async function withTransaction<T>(work: (session: mongoose.ClientSession) => Promise<T>): Promise<T> {
  const session = await mongoose.startSession();
  try {
    let out!: T;
    await session.withTransaction(async () => {
      out = await work(session);
    });
    return out;
  } finally {
    await session.endSession();
  }
}
