// Email delivery for OTP codes.
// Left unimplemented pending choice of provider (e.g. SendGrid, Postmark,
// SES) and finalized email template/copy.

async function sendOtpEmail(email, otpCode) {
  // TODO: implement email-sending logic
  // - render OTP email template
  // - send via configured provider using EMAIL_SERVICE_API_KEY
  throw new Error('Not implemented');
}

module.exports = { sendOtpEmail };
