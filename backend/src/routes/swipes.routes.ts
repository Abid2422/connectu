import { Router } from 'express';
import { recordSwipe } from '../controllers/swipes.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateSwipeRequest } from '../middleware/validate.middleware';

const router = Router();

router.post('/', requireAuth, validateSwipeRequest, recordSwipe);

export default router;
