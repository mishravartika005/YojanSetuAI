import { Router } from 'express';
import { listSchemes, getScheme, searchSchemes } from '../controllers/schemeController.js';

const router = Router();

router.get('/search', searchSchemes);
router.get('/', listSchemes);
router.get('/:id', getScheme);

export default router;