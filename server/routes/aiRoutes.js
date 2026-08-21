import { Router } from 'express';
import { askQuestion } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/chat', protect, askQuestion);

export default router;