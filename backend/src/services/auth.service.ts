import jwt from 'jsonwebtoken';
import type { User } from '@prisma/client';
import prisma from '../config/db';
import { generateOtp, verifyOtp } from './otp.service';
import { sendOtpEmail } from './email.service';

export const SESSION_COOKIE_NAME = 'connectu_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface SessionTokenPayload {
  sub: string;
  email: string;
}

async function findOrCreateUser(nyuEmail: string): Promise<User> {
  return prisma.user.upsert({
    where: { nyuEmail },
    update: {},
    create: { nyuEmail },
  });
}

// Issues an OTP for signup or resend. Rate limiting (1/60s, 5/hour per
// email) is enforced inside otpService.generateOtp for both call sites.
export async function requestSignup(nyuEmail: string): Promise<void> {
  await findOrCreateUser(nyuEmail);
  const otpCode = await generateOtp(nyuEmail);
  await sendOtpEmail(nyuEmail, otpCode);
}

export async function confirmSignup(
  nyuEmail: string,
  otpCode: string,
): Promise<{ user: User; token: string }> {
  await verifyOtp(nyuEmail, otpCode);

  const user = await prisma.user.update({
    where: { nyuEmail },
    data: { emailVerified: true },
  });

  const token = createSessionToken(user);
  return { user, token };
}

function createSessionToken(user: User): string {
  const payload: SessionTokenPayload = { sub: user.id, email: user.nyuEmail };
  return jwt.sign(payload, process.env.SESSION_SECRET, { expiresIn: SESSION_TTL_SECONDS });
}

export function verifySessionToken(token: string): SessionTokenPayload {
  return jwt.verify(token, process.env.SESSION_SECRET) as unknown as SessionTokenPayload;
}
