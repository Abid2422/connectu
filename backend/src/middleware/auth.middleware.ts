import type { RequestHandler } from 'express';
import { SESSION_COOKIE_NAME, verifySessionToken } from '../services/auth.service';

export const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    req.user = verifySessionToken(token);
    return next();
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid or expired session.' });
  }
};
