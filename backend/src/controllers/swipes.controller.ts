import type { RequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../config/db';
import { HttpError } from '../utils/httpError';

// POST /api/swipes — records a like/pass. If this completes a mutual like,
// creates a Match row (userAId/userBId canonicalized so the pair is
// order-independent) and reports it back.
export const recordSwipe: RequestHandler = async (req, res, next) => {
  try {
    const swiperId = req.user!.sub;
    const { swipedId, direction } = req.body as { swipedId: string; direction: 'like' | 'pass' };

    const swipedUser = await prisma.user.findUnique({ where: { id: swipedId }, select: { id: true } });
    if (!swipedUser) {
      throw new HttpError(404, 'User not found.');
    }

    try {
      await prisma.swipe.create({ data: { swiperId, swipedId, direction } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new HttpError(409, 'You have already swiped on this user.');
      }
      throw err;
    }

    if (direction !== 'like') {
      return res.status(201).json({ matched: false });
    }

    const reciprocal = await prisma.swipe.findUnique({
      where: { swiperId_swipedId: { swiperId: swipedId, swipedId: swiperId } },
    });

    if (!reciprocal || reciprocal.direction !== 'like') {
      return res.status(201).json({ matched: false });
    }

    const [userAId, userBId] = [swiperId, swipedId].sort();
    await prisma.match.upsert({
      where: { userAId_userBId: { userAId, userBId } },
      update: {},
      create: { userAId, userBId },
    });

    return res.status(201).json({ matched: true });
  } catch (err) {
    next(err);
    return;
  }
};
