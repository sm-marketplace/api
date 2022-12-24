import { REDIS_HOST, REDIS_PORT } from './config.js';
import redis from 'redis';

export const redisClient = redis.createClient({
  url: `redis://@${REDIS_HOST}:${REDIS_PORT}`,
});

redisClient.on("error", (error) => console.error(`Error : ${error}`));

await redisClient.connect();