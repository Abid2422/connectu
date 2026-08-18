const { Resend } = require('resend');

const FROM_ADDRESS = process.env.EMAIL_FROM || 'ConnectU <onboarding@resend.dev>';

let resend;
function getResendClient() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

async function sendOtpEmail(email, otpCode) {
  const { error } = await getResendClient().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: 'Your ConnectU verification code',
    text: `Your ConnectU verification code is ${otpCode}. It expires in 10 minutes.`,
    html: `<p>Your ConnectU verification code is <strong>${otpCode}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });

  if (error) {
    console.error('Resend send error:', error);
    const err = new Error('Failed to send verification email.');
    err.status = 502;
    throw err;
  }
}

module.exports = { sendOtpEmail };
