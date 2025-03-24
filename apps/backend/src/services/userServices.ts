// apps/backend/src/services/userServices.ts
import { supabase } from '../utils/supabaseClient';
import { User } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';
// const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPass: string;
}

function matchPass(password: string): boolean {
  const pass = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  return pass.test(password);
}

export async function signupUser({
  name,
  email,
  password,
  confirmPass,
}: SignupInput): Promise<User | null> {
  if (!name || !email || !password || !confirmPass) {
    throw new Error('Name, Email, Password, and Confirm Password are required.');
  }
  if (password !== confirmPass) {
    throw new Error('The Password and Confirm Password fields do not match.');
  }
  if (!matchPass(password)) {
    throw new Error(
      'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.'
    );
  }

  const { data: userList, error: listError } = await supabase.auth.admin.listUsers({});
  if (listError) {
    throw new Error(listError.message);
  }

  if (userList && userList.users && userList.users.length > 0) {
    const existingUser = userList.users.find(
      (user: any) => user.email.toLowerCase() === email.toLowerCase() && user.confirmed_at
    );
    if (existingUser) {
      throw new Error('User already exists.');
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: name },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}

interface ResetPasswordInput {
  newPassword: string;
  refreshToken: string;
}

export async function resetPassword(
  { newPassword, refreshToken }: ResetPasswordInput,
  authHeader?: string
): Promise<void> {
  if (!newPassword) {
    throw new Error('New password is required.');
  }
  if (!refreshToken) {
    throw new Error('Refresh token is missing.');
  }
  if (!authHeader) {
    throw new Error('Authorization header is required.');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Error('Token is missing.');
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: token,
    refresh_token: refreshToken,
  });
  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    throw new Error(error.message);
  }
}

const failedLogins: Record<string, { count: number; lockUntil?: number }> = {};

interface LoginResult {
  access_token: string;
  refresh_token: string;
  filteredUser: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export async function loginUser(email: string, password: string): Promise<LoginResult> {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const userLockout = failedLogins[email];
  if (userLockout && userLockout.lockUntil && Date.now() < userLockout.lockUntil) {
    throw new Error('Too many failed login attempts. Try again later.');
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
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Suspicious Login Activity Detected',
        text: `We've detected multiple failed login attempts to your account. If this wasn't you, please reset your password immediately.`,
      });
    }
    throw new Error('Invalid credentials.');
  }

  delete failedLogins[email];

  const user = data.user;
  if (!user) {
    throw new Error('User not found after login.');
  }

  // Generate a custom JWT that includes the userId
  // const token = jwt.sign(
  //   { userId: user.id, email: user.email, name: user.user_metadata?.first_name || '' },
  //   JWT_SECRET,
  //   { expiresIn: JWT_EXPIRATION }
  // );

  const filteredUser = {
    id: user.id,
    email: user.email || '',
    role: user.role || '',
    name: user.user_metadata?.first_name || '',
  };

  return { access_token: data.session.access_token, refresh_token: data.session.refresh_token, filteredUser };
}

interface ForgotPasswordInput {
  email: string;
}

export async function forgotPassword({ email }: ForgotPasswordInput): Promise<void> {
  if (!email) {
    throw { status: 400, message: 'Email is required.' };
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:4200/forgot-reset-password',
  });
  
  if (error) {
    throw { status: 400, message: error.message };
  }
}

