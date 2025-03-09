import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// Define a whitelist of endpoints that do not require authentication.
const white_list = [
  '/api/v1/auth/signup',
  '/api/v1/auth/login',
  '/api/v1/auth/forgotpassword',
  '/api/v1/auth/resetpassword',
  '/' 
];
declare module "express" {
  export interface Request {
    user?: {
      email: string;
      name: string;
    };
  }
}
export const auth = (req: Request, res: Response, next: NextFunction): Response | void => {
  // Check if the request URL is in the whitelist
  if (white_list.some((item) => req.originalUrl === item)) {
    return next();
  }

  // Check if authorization header exists and extract the token
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")?.[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token is missing or has expired.",
    });
  }

  try {
    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

    // Attach user info to the request object
    req.user = {
      email: decoded.email,
      name: decoded.name,      
    };

    return next(); // Continue to the next middleware
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};