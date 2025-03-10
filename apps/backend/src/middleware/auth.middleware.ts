import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabaseClient';

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
// Extend Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        name: string;
        email: string;
        // Add other user properties you need
      };
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  // Check if the request URL is in the whitelist
  if (white_list.some(item => req.originalUrl === item)) {
    return next();
  }

  // Check if authorization header exists and extract the token
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')?.[1];

  if (!token) {
    return res.status(401).json({
      message: 'Authorization token is required',
    });
  }

  try {
    // Verify token using Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      throw new Error(error?.message || 'Invalid user');
    }

    // Attach user info to the request object
    req.user = {
      name: user.user_metadata?.first_name || '',
      email: user.email ?? '',
      // Add other user properties from Supabase response
    };

    return next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({
      message: 'Invalid or expired token',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
