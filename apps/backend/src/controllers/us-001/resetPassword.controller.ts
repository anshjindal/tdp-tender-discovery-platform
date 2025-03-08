// apps/backend/src/controllers/us-001/resetPassword.controller.ts
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export async function resetPasswordHandler(req: Request, res: Response) {
  try {
    const { newPassword, refreshToken } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required.' });
    }
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is missing.' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ error: 'Authorization header is required.' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(400).json({ error: 'Token is missing.' });
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: refreshToken,
    });
    if (sessionError) {
      return res.status(400).json({ error: sessionError.message });
    }

    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

