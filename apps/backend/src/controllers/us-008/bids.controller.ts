// apps/backend/src/controllers/us-008/bids.controller.ts
import { Request, Response } from 'express';
import * as bidService from '../../services/bid.service';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
// import { io } from "../../main"; // Import Socket.IO instance from main.ts TRIAL
// import { supabase } from '../utils/supabaseClient';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (
  recipient: string,
  subject: string,
  message: string,
  retries = 3
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient,
      subject,
      text: message,
    });
    console.log(`Email sent to ${recipient}: ${subject}`);
  } catch (error) {
    console.error(`Email sending failed: ${error}`);
    if (retries > 0) {
      console.log(`Retrying... (${retries} attempts left)`);
      await sendEmail(recipient, subject, message, retries - 1);
    }
  }
};

export async function getBidsHandler(req: Request, res: Response) {
  const token = req.token
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.userId; // Use the UUID
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort_by = (req.query.sort_by as string) || 'last_updated_date';
    const filters = {
      bid_status: req.query.bid_status as string | undefined,
    };

    const { bids, pagination } = await bidService.getBidsForUser(token,userId, {
      page,
      limit,
      sort_by,
      filters,
    });

    return res.json({ bids, pagination });
  } catch (err: any) {
    console.error('Error fetching bids:', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function getSingleBidHandler(req: Request, res: Response) {
  const token = req.token;
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.userId;
    const { id } = req.params;
    const bid = await bidService.getBidById(token,userId, id);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }
    return res.json({ bid });
  } catch (err: any) {
    console.error('Error fetching single bid:', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function updateBidStatusHandler(req: Request, res: Response) {
  const token = req.token;
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userId = req.user.userId;
    const { id } = req.params;
    const { newStatus } = req.body;
    if (!newStatus) {
      return res.status(400).json({ error: 'newStatus is required' });
    }
    const updatedBid = await bidService.updateBidStatus(token,userId, id, newStatus);
    if (!updatedBid) {
      return res.status(404).json({ error: 'Bid not found or not updated' });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('bidStatusUpdated', { bid: updatedBid });
    }

    return res.json({ bid: updatedBid });
  } catch (err: any) {
    console.error('Error updating bid status:', err);
    return res.status(500).json({ error: err.message });
  }
}

export async function sendBidNotificationsHandler(req: Request, res: Response) {
  try {
    return res.json({ message: 'Notifications sent successfully' });
  } catch (error: any) {
    console.error('Error sending bid notifications:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

