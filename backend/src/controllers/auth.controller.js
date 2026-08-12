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

// POST /api/auth/verify-otp — complete signup: check OTP, mark verified.
async function verifyOtp(req, res, next) {
  try {
    const { nyuEmail, otpCode } = req.body;
    const user = await authService.confirmSignup(nyuEmail, otpCode);
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
