import { Router } from 'express';
import { uploadFiles } from '../controllers/us-003/upload_controller';

const uploadRouter: Router = Router();

// POST route for file uploads
uploadRouter.post('/upload', uploadFiles);

export default uploadRouter;

