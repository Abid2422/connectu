import { Router } from 'express';
import { getMe, updateMe } from '../controllers/users.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateProfileUpdateRequest } from '../middleware/validate.middleware';

const router = Router();

router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, validateProfileUpdateRequest, updateMe);

export default router;
