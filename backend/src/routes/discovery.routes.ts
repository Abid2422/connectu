import { Router } from 'express';
import { discover } from '../controllers/discovery.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, discover);

export default router;
