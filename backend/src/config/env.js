import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const candidateEnvPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../.env'),
];

const envPath = candidateEnvPaths.find((p) => fs.existsSync(p));
if (envPath) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const requiredVars = ['DATABASE_URL', 'JWT_SECRET'];
const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Create backend/.env from backend/.env.example and set all required values.',
  );
}

export const appEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
