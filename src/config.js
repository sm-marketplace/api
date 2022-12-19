import dotenv from 'dotenv'
dotenv.config();

// warning non existing vars
([
  'PINATA_API_KEY',
  'PINATA_SECRET_API_KEY',
  'HOST',
  'PORT',
  'STAGE',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_TTL',
]).forEach(v => {
  if (v in process.env) return
  console.warn(`[WARNING](env) variable "${v}" is not set`)
});

export const PINATA_CREDS = {
  pinataApiKey: process.env.PINATA_API_KEY, 
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY 
};

export const HOST = process.env.HOST;
export const PORT = process.env.PORT;
export const STAGE = process.env.STAGE;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_TTL = process.env.REDIS_TTL;
