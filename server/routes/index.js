import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import schemeRoutes from './schemeRoutes.js';
import recommendationRoutes from './recommendationRoutes.js';
import savedSchemeRoutes from './savedSchemeRoutes.js';
import applicationRoutes from './applicationRoutes.js';
import aiRoutes from './aiRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/schemes', schemeRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/saved-schemes', savedSchemeRoutes);
router.use('/applications', applicationRoutes);
router.use('/ai', aiRoutes);

router.get('/', (_request, response) => {
  response.json({
    success: true,
    message: 'Welcome to YojanSetu AI API',
  });
});

router.get('/health', (_request, response) => {
  response.json({
    success: true,
    message: 'YojanSetu AI backend is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;