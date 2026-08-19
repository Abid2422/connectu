import type { RequestHandler } from 'express';
import { isNyuEmail } from '../utils/nyuEmailValidator';

const MAX_SHORT_FIELD_LENGTH = 100;
const MAX_TAG_LENGTH = 40;
const INTERESTS_MIN = 3;
const INTERESTS_MAX = 8;
const LOOKING_FOR_MIN = 1;
const LOOKING_FOR_MAX = 4;
const BIO_MIN = 20;
const BIO_MAX = 300;

export const validateSignupRequest: RequestHandler = (req, res, next) => {
  const { nyuEmail } = req.body || {};

  if (!nyuEmail || !isNyuEmail(nyuEmail)) {
    return res.status(400).json({ error: 'A valid @nyu.edu email is required.' });
  }

  return next();
};

export const validateOtpVerifyRequest: RequestHandler = (req, res, next) => {
  const { nyuEmail, otpCode } = req.body || {};

  if (!nyuEmail || !isNyuEmail(nyuEmail)) {
    return res.status(400).json({ error: 'A valid @nyu.edu email is required.' });
  }

  if (!otpCode || typeof otpCode !== 'string') {
    return res.status(400).json({ error: 'An OTP code is required.' });
  }

  return next();
};

function isNonEmptyString(value: unknown, maxLength = MAX_SHORT_FIELD_LENGTH): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

function isStringArrayInRange(value: unknown, min: number, max: number): value is string[] {
  if (!Array.isArray(value)) return false;
  if (value.length < min || value.length > max) return false;
  return value.every((item) => isNonEmptyString(item, MAX_TAG_LENGTH));
}

// PUT /api/users/me — validates a full profile-completion submission.
// All fields are required (aside from name) since this endpoint doubles as
// "complete onboarding": a successful call always marks onboardingComplete.
export const validateProfileUpdateRequest: RequestHandler = (req, res, next) => {
  const { name, major, year, campus, interests, lookingFor, bio } = req.body || {};

  if (name !== undefined && name !== null && !isNonEmptyString(name)) {
    return res.status(400).json({ error: 'Name must be a non-empty string.' });
  }

  if (!isNonEmptyString(major)) {
    return res.status(400).json({ error: 'Major is required.' });
  }

  if (!isNonEmptyString(year)) {
    return res.status(400).json({ error: 'Year is required.' });
  }

  if (!isNonEmptyString(campus)) {
    return res.status(400).json({ error: 'Campus is required.' });
  }

  if (!isStringArrayInRange(interests, INTERESTS_MIN, INTERESTS_MAX)) {
    return res
      .status(400)
      .json({ error: `Interests must include between ${INTERESTS_MIN} and ${INTERESTS_MAX} items.` });
  }

  if (!isStringArrayInRange(lookingFor, LOOKING_FOR_MIN, LOOKING_FOR_MAX)) {
    return res
      .status(400)
      .json({ error: `Looking for must include between ${LOOKING_FOR_MIN} and ${LOOKING_FOR_MAX} items.` });
  }

  if (typeof bio !== 'string' || bio.trim().length < BIO_MIN || bio.trim().length > BIO_MAX) {
    return res.status(400).json({ error: `Bio must be between ${BIO_MIN} and ${BIO_MAX} characters.` });
  }

  return next();
};
