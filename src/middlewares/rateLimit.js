import rateLimit from 'express-rate-limit';

// set up rate limiter: maximum of five requests per minute
export const rateLimiter = rateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5
});