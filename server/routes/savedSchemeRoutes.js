import { Router } from 'express';
import {
  saveScheme,
  removeSavedScheme,
  getSavedSchemes,
  checkSavedScheme,
} from '../controllers/savedSchemeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getSavedSchemes);
router.post('/:schemeId', saveScheme);
router.delete('/:schemeId', removeSavedScheme);
router.get('/:schemeId/status', checkSavedScheme);

export default router;
