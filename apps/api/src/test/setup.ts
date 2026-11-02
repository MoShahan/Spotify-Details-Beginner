import { config } from 'dotenv';

config({ path: '.env' });

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim().length < 16) {
  process.env.JWT_SECRET = 'test-jwt-secret-cadence-16+';
}
