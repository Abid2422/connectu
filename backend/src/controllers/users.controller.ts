import type { RequestHandler } from 'express';
import prisma from '../config/db';
import { HttpError } from '../utils/httpError';

// GET /api/users/me — return the logged-in user's own profile. Reads
// req.user.sub (set by requireAuth) and fetches fresh from the DB rather
// than trusting the JWT payload, since fields like onboardingComplete can
// change after the session token was issued.
export const getMe: RequestHandler = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) {
      throw new HttpError(404, 'User not found.');
    }
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
