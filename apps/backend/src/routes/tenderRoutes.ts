import { Router } from 'express';
import { searchTendersHandler } from '../controllers/us-004/tender_controller';

const tenderRouter: Router = Router(); 

tenderRouter.get('/search', searchTendersHandler);

export default tenderRouter;