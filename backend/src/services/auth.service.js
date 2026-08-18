const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const otpService = require('./otp.service');
const emailService = require('./email.service');

const SESSION_COOKIE_NAME = 'connectu_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

async function findOrCreateUser(nyuEmail) {
  return prisma.user.upsert({
    where: { nyuEmail },
    update: {},
    create: { nyuEmail },
  });
}

// Issues an OTP for signup or resend. Rate limiting (1/60s, 5/hour per
// email) is enforced inside otpService.generateOtp for both call sites.
async function requestSignup(nyuEmail) {
  await findOrCreateUser(nyuEmail);
  const otpCode = await otpService.generateOtp(nyuEmail);
  await emailService.sendOtpEmail(nyuEmail, otpCode);
}

async function confirmSignup(nyuEmail, otpCode) {
  await otpService.verifyOtp(nyuEmail, otpCode);

  const user = await prisma.user.update({
    where: { nyuEmail },
    data: { emailVerified: true },
  });

  const token = createSessionToken(user);
  return { user, token };
}

function createSessionToken(user) {
  return jwt.sign({ sub: user.id, email: user.nyuEmail }, process.env.SESSION_SECRET, {
    expiresIn: SESSION_TTL_SECONDS,
  });
}

function verifySessionToken(token) {
  return jwt.verify(token, process.env.SESSION_SECRET);
}

module.exports = {
  requestSignup,
  confirmSignup,
  verifySessionToken,
  SESSION_COOKIE_NAME,
  SESSION_TTL_SECONDS,
};
