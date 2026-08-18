const authService = require('../services/auth.service');

// POST /api/auth/signup — start signup: validate NYU email, send OTP.
async function signup(req, res, next) {
  try {
    const { nyuEmail } = req.body;
    await authService.requestSignup(nyuEmail);
    res.status(202).json({ message: 'OTP sent.' });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/verify-otp — complete signup: check OTP, mark verified,
// issue a session cookie immediately (no separate login step).
async function verifyOtp(req, res, next) {
  try {
    const { nyuEmail, otpCode } = req.body;
    const { user, token } = await authService.confirmSignup(nyuEmail, otpCode);

    res.cookie(authService.SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: authService.SESSION_TTL_SECONDS * 1000,
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/resend-otp — invalidate prior OTP, issue a new one.
async function resendOtp(req, res, next) {
  try {
    const { nyuEmail } = req.body;
    await authService.requestSignup(nyuEmail);
    res.status(202).json({ message: 'OTP resent.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { signup, verifyOtp, resendOtp };
