import { Resend } from 'resend';
import { HttpError } from '../utils/httpError';

const FROM_ADDRESS = process.env.EMAIL_FROM || 'ConnectU <onboarding@resend.dev>';

let resend: Resend | undefined;
function getResendClient(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

export async function sendOtpEmail(email: string, otpCode: string): Promise<void> {
  const { error } = await getResendClient().emails.send({
    from: FROM_ADDRESS,
    to: email,
    subject: 'Your ConnectU verification code',
    text: `Your ConnectU verification code is ${otpCode}. It expires in 10 minutes.`,
    html: `<p>Your ConnectU verification code is <strong>${otpCode}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });

  if (error) {
    console.error('Resend send error:', error);
    throw new HttpError(502, 'Failed to send verification email.');
  }
}
