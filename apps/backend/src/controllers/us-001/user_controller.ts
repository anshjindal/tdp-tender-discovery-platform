// apps/backend/src/controllers/us-001/user_controller.ts
import { Request, Response } from 'express';
import { loginUser } from '../../services/userServices';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
const userServices = require('../../services/userServices');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function signupHandler(req: Request, res: Response) {
  try {
    const user = await userServices.signupUser(req.body);
    return res.status(201).json({
      message: 'Sign up completed successfully. Please check your email to verify your account.',
      user,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function resetPasswordHandler(req: Request, res: Response) {
  try {
    await userServices.resetPassword(req.body, req.headers.authorization);
    return res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { access_token, refresh_token, filteredUser } = await loginUser(email, password);
    return res.json({
      message: 'Login successful',
      access_token,
      refresh_token,
      user: filteredUser,
      redirect: '/',
    });
  } catch (err: any) {
    if (err.message === 'Too many failed login attempts. Try again later.') {
      return res.status(403).json({ error: err.message });
    }
    return res.status(400).json({ error: err.message });
  }
}

export async function forgotPasswordHandler(req: Request, res: Response): Promise<Response> {
  try {
    await userServices.forgotPassword(req.body);
    return res.status(200).json({
      message:
        'The Password reset email has been sent. Please check your email and follow the instructions to reset your password.',
    });
  } catch (err: any) {
    return res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getAccount(req: Request, res: Response) {
  return res.json({ user: req.user });
}

export async function testEmail(req: Request, res: Response) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'viettien24.ottawa@gmail.com',
      subject: 'Test Email',
      text: 'If you received this, the email setup works!',
    });
    res.status(200).json({ message: 'Test email sent' });
  } catch (err: any) {
    console.error('Email error:', err);
    res.status(500).json({ error: err.message });
  }
}

