import type { RequestHandler } from 'express';
import prisma from '../config/db';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Fields shown to other users browsing discovery — deliberately excludes
// nyuEmail, emailVerified, onboardingComplete, createdAt/updatedAt, and
// lookingFor. There's no spec for what a candidate card should expose, so
// this errs toward "only what the card needs," not "the whole User row."
const PUBLIC_PROFILE_SELECT = {
  id: true,
  name: true,
  major: true,
  year: true,
  campus: true,
  bio: true,
  interests: true,
  avatarUrl: true,
} as const;

function parseLimit(value: unknown): number {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
}

function parseFilter(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

// GET /api/discover — a page of candidate profiles for the logged-in user.
// Excludes self, anyone already swiped on (either direction), and users
// who haven't finished onboarding. There's no separate "page 2" cursor:
// each call re-queries excluding whatever's already been swiped, which is
// the usual pattern for a swipe feed (the pool just shrinks as you go)
// rather than paging through a fixed list.
export const discover: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.sub;
    const limit = parseLimit(req.query.limit);
    const major = parseFilter(req.query.major);
    const year = parseFilter(req.query.year);

    const swiped = await prisma.swipe.findMany({
      where: { swiperId: userId },
      select: { swipedId: true },
    });
    const excludedIds = [userId, ...swiped.map((s) => s.swipedId)];

    const candidates = await prisma.user.findMany({
      where: {
        id: { notIn: excludedIds },
        onboardingComplete: true,
        ...(major ? { major: { equals: major, mode: 'insensitive' } } : {}),
        ...(year ? { year: { equals: year, mode: 'insensitive' } } : {}),
      },
      // No lastActiveAt/presence tracking exists yet — updatedAt (bumped by
      // any profile/photo edit) is used as a "recently active" stand-in.
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: PUBLIC_PROFILE_SELECT,
    });

    res.status(200).json({ candidates });
  } catch (err) {
    next(err);
  }
};
