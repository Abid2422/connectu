const crypto = require('crypto');
const prisma = require('../config/db');
const redisClient = require('../config/redis');

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;
const RESEND_HOURLY_LIMIT = 5;
const RESEND_HOURLY_WINDOW_SECONDS = 60 * 60;

function generateNumericOtp() {
  const otp = crypto.randomInt(0, 10 ** OTP_LENGTH);
  return otp.toString().padStart(OTP_LENGTH, '0');
}

function hashOtp(otpCode) {
  return crypto.createHash('sha256').update(otpCode).digest('hex');
}

function hashesMatch(candidateHash, storedHash) {
  const candidateBuf = Buffer.from(candidateHash, 'hex');
  const storedBuf = Buffer.from(storedHash, 'hex');

  if (candidateBuf.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(candidateBuf, storedBuf);
}

// Applies to any OTP issuance (initial signup or resend) so the limits
// can't be bypassed by hitting /signup repeatedly instead of /resend-otp.
async function enforceIssueRateLimit(email) {
  const cooldownKey = `otp:cooldown:${email}`;
  const hourlyKey = `otp:hourly:${email}`;

  const acquired = await redisClient.set(cooldownKey, '1', {
    NX: true,
    EX: RESEND_COOLDOWN_SECONDS,
  });

  if (!acquired) {
    const ttl = await redisClient.ttl(cooldownKey);
    const err = new Error(`Please wait ${Math.max(ttl, 1)}s before requesting another code.`);
    err.status = 429;
    throw err;
  }

  const count = await redisClient.incr(hourlyKey);
  if (count === 1) {
    await redisClient.expire(hourlyKey, RESEND_HOURLY_WINDOW_SECONDS);
  }

  if (count > RESEND_HOURLY_LIMIT) {
    const err = new Error('Too many code requests for this email. Please try again later.');
    err.status = 429;
    throw err;
  }
}

async function generateOtp(email) {
  await enforceIssueRateLimit(email);

  const otpCode = generateNumericOtp();
  const otpHash = hashOtp(otpCode);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.$transaction([
    prisma.otp.deleteMany({ where: { email } }),
    prisma.otp.create({ data: { email, otpHash, expiresAt } }),
  ]);

  return otpCode;
}

async function verifyOtp(email, otpCode) {
  const record = await prisma.otp.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    const err = new Error('No verification code found for this email. Request a new one.');
    err.status = 400;
    throw err;
  }

  if (record.expiresAt < new Date()) {
    await prisma.otp.delete({ where: { id: record.id } });
    const err = new Error('Verification code has expired. Request a new one.');
    err.status = 400;
    throw err;
  }

  if (!hashesMatch(hashOtp(otpCode), record.otpHash)) {
    const err = new Error('Invalid verification code.');
    err.status = 400;
    throw err;
  }

  await prisma.otp.delete({ where: { id: record.id } });
}

module.exports = { generateOtp, verifyOtp };
