import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabaseClient';

const white_list = [
  '/api/v1/auth/signup',
  '/api/v1/auth/login',
  '/api/v1/auth/forgotpassword',
  '/api/v1/auth/resetpassword',
  '/filterTendersWithAI',
  '/api/v1/documents/upload',
  '/api/v1/documents/extract',
  '/api/v1/documents/:id/data',
  '/' 
];

declare module 'express' {
  export interface Request {
    token?: string;
    user?: {
      userId: string;
      email: string;
      name: string;
    };
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  // Skip authentication for whitelisted URLs
  if (white_list.some(item => req.originalUrl === item)) {
    return next();
  }

  // Extract the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Authorization token is required',
    });
  }

  // Attach the token to req.token
  req.token = token;

  try {
    // Retrieve user info from Supabase using the token
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new Error(error?.message || 'Invalid user');
    }

    // Attach the user information to req.user
    req.user = {
      userId: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.first_name || '',
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
