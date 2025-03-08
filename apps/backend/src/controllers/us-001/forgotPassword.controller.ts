// apps/backend/src/controllers/us-001/forgotPassword.controller.ts
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export async function forgotPasswordHandler(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    // Updated redirectTo URL to match the frontend reset page
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:4200/forgot-reset-password'
    });
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: 'The Password reset email has been sent. Please check your email and follow the instructions to reset your password.'
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
