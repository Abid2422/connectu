import { Router } from 'express';
import { getMe } from '../controllers/users.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/me', requireAuth, getMe);

export default router;
