import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

// .env lives in the repo root, not in backend/
dotenv.config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) });

export const config = {
  port: Number(process.env.PORT || 4000),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/software_tracker?replicaSet=rs0&directConnection=true',
  devAuth: process.env.DEV_AUTH === 'true',
};
