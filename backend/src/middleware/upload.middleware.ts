import multer from 'multer';
import { HttpError } from '../utils/httpError';

// Single source of truth for what a "photo" upload is allowed to be —
// shared with storage.service.ts, which uses the extensions to name objects.
export const ALLOWED_PHOTO_MIME_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MAX_PHOTO_SIZE_BYTES = 5 * 1024 * 1024; // 5MB — not spec'd, a reasonable default for a profile photo.

// Buffers the file in memory rather than on disk — uploads go straight
// through to R2, so nothing needs to survive past the request.
export const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_PHOTO_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (!(file.mimetype in ALLOWED_PHOTO_MIME_TYPES)) {
      cb(new HttpError(400, 'Only JPEG, PNG, and WebP images are allowed.'));
      return;
    }
    cb(null, true);
  },
}).single('photo');
