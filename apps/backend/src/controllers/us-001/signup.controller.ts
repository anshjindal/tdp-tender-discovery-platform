// apps/backend/src/controllers/us-001/signup.controller.ts
import { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

function matchPass(password: string): boolean {
  const pass = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
  return pass.test(password);
}

export async function signupHandler(req: Request, res: Response) {
  try {
    const { name, email, password, confirmPass } = req.body;

    if (!name || !email || !password || !confirmPass) {
      return res
        .status(400)
        .json({ error: 'Name, Email, Password, and Confirm Password are required.' });
    }

    if (password !== confirmPass) {
      return res.status(400).json({ error: 'The Password and Confirm Password fields do not match.' });
    }

    if (!matchPass(password)) {
      return res.status(400).json({
        error:
          'Password must be at least 8 characters long, it must contain at least one uppercase letter, must have one number, and must contain one special character.',
      });
    }
    
    // Check if user already exists using Supabase admin API.
    const { data: userList, error: listError } = await supabase.auth.admin.listUsers({ query: email });
    if (listError) {
      return res.status(500).json({ error: listError.message });
    }
    if (userList && userList.users && userList.users.length > 0) {
      // Filter for an email match ignoring case sensitivity
      const existingUser = userList.users.find((user: any) => 
        user.email.toLowerCase() === email.toLowerCase() && user.confirmed_at
      );
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }
    
    // Proceed with Supabase sign up.
    const { data, error } = await supabase.auth.signUp(
      { email, password },
      { data: { fullName: name } }
    );
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: 'The sign up has completed successfully. Please check your email to verify your account.',
      user: data.user,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
