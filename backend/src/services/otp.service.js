// OTP generation, storage, and verification.
// Left unimplemented pending a security design review (code length/format,
// expiry window, resend/rate-limiting policy, storage backend).

async function generateOtp(email) {
  // TODO: implement OTP generation logic
  // - generate a code
  // - invalidate any previous unexpired OTPs for this email
  // - persist the new OTP with an expiry
  throw new Error('Not implemented');
}

async function verifyOtp(email, otpCode) {
  // TODO: implement OTP verification logic
  // - look up the most recent OTP for this email
  // - check expiry and match
  // - mark user emailVerified on success
  throw new Error('Not implemented');
}

module.exports = { generateOtp, verifyOtp };
