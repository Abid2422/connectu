import { Router } from 'express';
import { getMe, updateMe } from '../controllers/users.controller';
import { uploadAvatar, addPhoto, removePhoto } from '../controllers/photos.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validateProfileUpdateRequest } from '../middleware/validate.middleware';
import { uploadPhoto } from '../middleware/upload.middleware';

const router = Router();

router.get('/me', requireAuth, getMe);
router.put('/me', requireAuth, validateProfileUpdateRequest, updateMe);
router.put('/me/avatar', requireAuth, uploadPhoto, uploadAvatar);
router.post('/me/photos', requireAuth, uploadPhoto, addPhoto);
router.delete('/me/photos/:index', requireAuth, removePhoto);

export default router;
