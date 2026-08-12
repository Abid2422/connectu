const { isNyuEmail } = require('../utils/nyuEmailValidator');

function validateSignupRequest(req, res, next) {
  const { nyuEmail } = req.body || {};

  if (!nyuEmail || !isNyuEmail(nyuEmail)) {
    return res.status(400).json({ error: 'A valid @nyu.edu email is required.' });
  }

  next();
}

function validateOtpVerifyRequest(req, res, next) {
  const { nyuEmail, otpCode } = req.body || {};

  if (!nyuEmail || !isNyuEmail(nyuEmail)) {
    return res.status(400).json({ error: 'A valid @nyu.edu email is required.' });
  }

  if (!otpCode || typeof otpCode !== 'string') {
    return res.status(400).json({ error: 'An OTP code is required.' });
  }

  next();
}

module.exports = { validateSignupRequest, validateOtpVerifyRequest };
