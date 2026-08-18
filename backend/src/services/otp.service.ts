import crypto from 'crypto';
import prisma from '../config/db';
import redisClient from '../config/redis';
import { HttpError } from '../utils/httpError';

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;
const RESEND_HOURLY_LIMIT = 5;
const RESEND_HOURLY_WINDOW_SECONDS = 60 * 60;

function generateNumericOtp(): string {
  const otp = crypto.randomInt(0, 10 ** OTP_LENGTH);
  return otp.toString().padStart(OTP_LENGTH, '0');
}

function hashOtp(otpCode: string): string {
  return crypto.createHash('sha256').update(otpCode).digest('hex');
}

function hashesMatch(candidateHash: string, storedHash: string): boolean {
  const candidateBuf = Buffer.from(candidateHash, 'hex');
  const storedBuf = Buffer.from(storedHash, 'hex');

  if (candidateBuf.length !== storedBuf.length) return false;
  return crypto.timingSafeEqual(candidateBuf, storedBuf);
}

// Applies to any OTP issuance (initial signup or resend) so the limits
// can't be bypassed by hitting /signup repeatedly instead of /resend-otp.
async function enforceIssueRateLimit(email: string): Promise<void> {
  const cooldownKey = `otp:cooldown:${email}`;
  const hourlyKey = `otp:hourly:${email}`;

  const acquired = await redisClient.set(cooldownKey, '1', {
    NX: true,
    EX: RESEND_COOLDOWN_SECONDS,
  });

  if (!acquired) {
    const ttl = await redisClient.ttl(cooldownKey);
    throw new HttpError(429, `Please wait ${Math.max(ttl, 1)}s before requesting another code.`);
  }

  const count = await redisClient.incr(hourlyKey);
  if (count === 1) {
    await redisClient.expire(hourlyKey, RESEND_HOURLY_WINDOW_SECONDS);
  }

  if (count > RESEND_HOURLY_LIMIT) {
    throw new HttpError(429, 'Too many code requests for this email. Please try again later.');
  }
}

export async function generateOtp(email: string): Promise<string> {
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

export async function verifyOtp(email: string, otpCode: string): Promise<void> {
  const record = await prisma.otp.findFirst({
    where: { email },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    throw new HttpError(400, 'No verification code found for this email. Request a new one.');
  }

  if (record.expiresAt < new Date()) {
    await prisma.otp.delete({ where: { id: record.id } });
    throw new HttpError(400, 'Verification code has expired. Request a new one.');
  }

  if (!hashesMatch(hashOtp(otpCode), record.otpHash)) {
    throw new HttpError(400, 'Invalid verification code.');
  }

  await prisma.otp.delete({ where: { id: record.id } });
}
