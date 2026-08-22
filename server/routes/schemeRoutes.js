import { Router } from 'express';
import { listSchemes, getScheme, searchSchemes } from '../controllers/schemeController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/search', searchSchemes);
router.get('/', listSchemes);
router.get('/:id', optionalProtect, getScheme);

export default router;