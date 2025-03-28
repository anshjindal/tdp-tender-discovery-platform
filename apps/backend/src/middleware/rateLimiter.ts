// apps/backend/src/middleware/rateLimiter.ts
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, //no more than 100 each 15 minutes
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
