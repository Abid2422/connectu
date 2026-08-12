const prisma = require('../config/db');
// const otpService = require('./otp.service');
// const emailService = require('./email.service');

// Orchestrates signup/verification. User lookup/creation is implemented;
// the OTP issuance and verification steps delegate to otp.service and
// email.service, which are stubbed pending the security design review.

async function findOrCreateUser(nyuEmail) {
  return prisma.user.upsert({
    where: { nyuEmail },
    update: {},
    create: { nyuEmail },
  });
}

async function requestSignup(nyuEmail) {
  await findOrCreateUser(nyuEmail);

  // TODO: once otp.service/email.service are implemented, wire:
  // const otpCode = await otpService.generateOtp(nyuEmail);
  // await emailService.sendOtpEmail(nyuEmail, otpCode);
  throw new Error('Not implemented');
}

async function confirmSignup(nyuEmail, otpCode) {
  // TODO: once otp.service is implemented, wire:
  // await otpService.verifyOtp(nyuEmail, otpCode);
  // return prisma.user.update({ where: { nyuEmail }, data: { emailVerified: true } });
  throw new Error('Not implemented');
}

module.exports = { requestSignup, confirmSignup };
