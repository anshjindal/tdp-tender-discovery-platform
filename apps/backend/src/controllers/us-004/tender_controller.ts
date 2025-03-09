import { Request, Response } from 'express';
const tenderServices = require('../../services/tenderServices');

export const searchTendersHandler = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Extract and validate query parameters
    const queryParams = {
      query: req.query.query,
      category: req.query.category,
      location: req.query.location,
      status: req.query.status,
      deadline_from: req.query.deadline_from,
      deadline_to: req.query.deadline_to,
      sort_by: req.query.sort_by,
      page: req.query.page,
      limit: req.query.limit,
    };

    // Pass processed parameters to service
    const result = await tenderServices.searchTendersService(queryParams);
    
    return res.json(result);
  } catch (error: unknown) {
    console.error('Error fetching tenders:', error);
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'An unknown error occurred' });
  }
};