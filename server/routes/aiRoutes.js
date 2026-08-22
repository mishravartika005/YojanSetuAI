import { Router } from 'express';
import { askQuestion, navigateNeed } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/chat', protect, askQuestion);
router.post('/navigator', protect, navigateNeed);

export default router;