import type { RequestHandler } from 'express';
import prisma from '../config/db';
import { HttpError } from '../utils/httpError';
import { uploadPhotoObject, deletePhotoObject } from '../services/storage.service';

export const MAX_ADDITIONAL_PHOTOS = 3;

// PUT /api/users/me/avatar — replaces the main profile photo. The old
// object (if any) is deleted from storage after the DB update succeeds.
export const uploadAvatar: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new HttpError(400, 'A photo file is required.');
    }

    const previous = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.sub },
      select: { avatarUrl: true },
    });

    const avatarUrl = await uploadPhotoObject(req.user!.sub, 'avatar', req.file.buffer, req.file.mimetype);

    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data: { avatarUrl },
    });

    await deletePhotoObject(previous.avatarUrl);

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/me/photos — appends one additional photo, up to
// MAX_ADDITIONAL_PHOTOS.
export const addPhoto: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new HttpError(400, 'A photo file is required.');
    }

    const existing = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.sub },
      select: { photoUrls: true },
    });

    if (existing.photoUrls.length >= MAX_ADDITIONAL_PHOTOS) {
      throw new HttpError(400, `You can only have up to ${MAX_ADDITIONAL_PHOTOS} additional photos.`);
    }

    const photoUrl = await uploadPhotoObject(req.user!.sub, 'photo', req.file.buffer, req.file.mimetype);

    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data: { photoUrls: { push: photoUrl } },
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/me/photos/:index — removes one additional photo by its
// position in the array.
export const removePhoto: RequestHandler = async (req, res, next) => {
  try {
    const index = Number(req.params.index);

    const existing = await prisma.user.findUniqueOrThrow({
      where: { id: req.user!.sub },
      select: { photoUrls: true },
    });

    if (!Number.isInteger(index) || index < 0 || index >= existing.photoUrls.length) {
      throw new HttpError(404, 'Photo not found.');
    }

    const photoUrls = existing.photoUrls.filter((_url, i) => i !== index);
    const [removedUrl] = existing.photoUrls.slice(index, index + 1);

    const user = await prisma.user.update({
      where: { id: req.user!.sub },
      data: { photoUrls },
    });

    await deletePhotoObject(removedUrl);

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};
