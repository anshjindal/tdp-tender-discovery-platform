import {Request, Response }  from 'express';
const submittenderServices = require('../../services/submittenderServices');
import { io } from "../../main";

// import { supabase } from '../../utils/supabaseClient';

// Fetch list of tenders for authenticated users
export const subUserTenderHandler = async (req: Request, res: Response): Promise<Response> => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')?.[1];
    try {

        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const userId = req.user.userId;
        // Extract and validate query parameters
        const queryParams = {
            status: req.query.status,
            startDate: req.query.submitted_at,
            endDate: req.query.submitted_at,
            page: req.query.page,
            limit: req.query.limit,
        };

        // Pass processed parameters to service
        const result = await submittenderServices.searchSubTendersService(token,userId, queryParams);
       
        return res.status(200).json(result);
    } catch (error: unknown) {
        console.error('Error fetching submitted tenders:', error);
        if (error instanceof Error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(500).json({ error: 'An unknown error occurred' });
    }      
};

// Update tender info
export async function updateSubTenderHandler(req: Request, res: Response) {

    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')?.[1];
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userId = req.user.userId;
      const { id } = req.params;
      const { newData } = req.body;
      console.log('updated data',newData);
      if (!newData) {
        return res.status(400).json({ error: 'newStatus is required' });
      }
      const updatedSubTender = await submittenderServices.updateSubTender(token,userId, id, newData);
      if (!updatedSubTender) {
        return res.status(404).json({ error: 'Tender not found or not updated' });
      }
  
      
    io.emit('sunTenderUpdated', { subtender: updatedSubTender });
      
  
      return res.json({ subtender: updatedSubTender });
    } catch (err: any) {
      console.error('Error updating bid status:', err);
      return res.status(500).json({ error: err.message });
    }
}


export async function getSubTenderByIDHandler(req: Request, res: Response) {
  
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')?.[1];
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const userId = req.user.userId;
      const { id: subId } = req.params;
      console.log("Requested subId>>>>>>>>>>>", subId);
      const tender = await submittenderServices.getSubTenderById(token, userId, subId);
      if (!tender) {
        return res.status(404).json({ error: 'Tender not found' });
      }

      console.log(tender);

      return res.json({ tender });

      
    } catch (err: any) {
      console.error('Error fetching single tender:', err);
      return res.status(500).json({ error: err.message });
}
}
  
