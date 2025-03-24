import { Router } from 'express';
import { searchTendersHandler } from '../controllers/us-004/tender_controller';
import { subUserTenderHandler, updateSubTenderHandler, getSubTenderByIDHandler  } from '../controllers/us-002/subtender_Controller';

const tenderRouter: Router = Router(); 
// API: api/v1/tenders/?

// Search available tenders
tenderRouter.get('/search', searchTendersHandler);

// Submitted tender list by auth user
tenderRouter.get('/submittedtenders', subUserTenderHandler);

//Get tender by ID
tenderRouter.get('/submittedtenders/:id', getSubTenderByIDHandler);

// Update tender by ID
tenderRouter.patch('/:id', updateSubTenderHandler);

export default tenderRouter;
