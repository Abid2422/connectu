import type { RequestHandler } from 'express';
import { isNyuEmail } from '../utils/nyuEmailValidator';

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
