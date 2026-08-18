import type { RequestHandler } from 'express';
import {
  requestSignup,
  confirmSignup,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
} from '../services/auth.service';

// POST /api/auth/signup — start signup: validate NYU email, send OTP.
export const signup: RequestHandler = async (req, res, next) => {
  try {
    const { nyuEmail } = req.body;
    await requestSignup(nyuEmail);
    res.status(202).json({ message: 'OTP sent.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/verify-otp — complete signup: check OTP, mark verified,
// issue a session cookie immediately (no separate login step).
export const verifyOtp: RequestHandler = async (req, res, next) => {
  try {
    const { nyuEmail, otpCode } = req.body;
    const { user, token } = await confirmSignup(nyuEmail, otpCode);

    res.cookie(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_TTL_SECONDS * 1000,
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/resend-otp — invalidate prior OTP, issue a new one.
export const resendOtp: RequestHandler = async (req, res, next) => {
  try {
    const { nyuEmail } = req.body;
    await requestSignup(nyuEmail);
    res.status(202).json({ message: 'OTP resent.' });
  } catch (err) {
    next(err);
  }
};
