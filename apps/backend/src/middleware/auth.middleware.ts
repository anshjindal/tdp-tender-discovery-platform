import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Define a whitelist of endpoints that do not require authentication.
const whitelist = [
  '/api/v1/auth/signup',
  '/api/v1/auth/login',
  '/api/v1/auth/forgot-password',
  '/api/v1/auth/reset-password',
  '/' 
];

export function auth(req: Request, res: Response, next: NextFunction): void {
  // Check if the request URL starts with any whitelisted path.
  if (whitelist.some(path => req.originalUrl.startsWith(path))) {
    return next();
  }

  // Look for the Authorization header 
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Access token is missing.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token is missing.' });
  }

  try {
    // Verify the token using the secret defined in the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Attach user info 
    req.user = {
      email: (decoded as any).email,
      name: (decoded as any).name,
    };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is expired or invalid.' });
  }
}

