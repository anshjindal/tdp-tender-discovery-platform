import { Router } from 'express';
import { extractDocumentData, getExtractedData } from '../controllers/us-012/nlpController';
import { auth } from '../middleware/auth.middleware';

const router: Router = Router();

// Protect routes as needed
router.post('/extract', auth, extractDocumentData);
router.get('/:id/data', auth, getExtractedData);

export default router;

