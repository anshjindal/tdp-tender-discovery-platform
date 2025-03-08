// apps/backend/src/controllers/us-001/login.controller.ts
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

// In-memory store for failed login attempts
const failedLogins: { [email: string]: { count: number; lockUntil?: number } } = {};

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';
const JWT_EXPIRATION = '1h';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function loginHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const userLockout = failedLogins[email];
    if (userLockout && userLockout.lockUntil && Date.now() < userLockout.lockUntil) {
      return res.status(403).json({ error: 'Too many failed login attempts. Try again later.' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (!failedLogins[email]) {
        failedLogins[email] = { count: 1 };
      } else {
        failedLogins[email].count += 1;
      }
      if (failedLogins[email].count >= 5) {
        failedLogins[email].lockUntil = Date.now() + 5 * 60 * 1000;
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Suspicious Login Activity Detected',
          text: `We've detected multiple failed login attempts to your account. If this wasn't you, please reset your password immediately.`,
        });
      }
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    delete failedLogins[email];

    const token = jwt.sign({ userId: data.user?.id, email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    res.json({
      message: 'Login successful',
      token,
      redirect: '/dashboard',
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}

