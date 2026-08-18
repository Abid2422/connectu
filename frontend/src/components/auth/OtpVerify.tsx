import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export default function OtpVerify() {
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { pendingEmail, setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!pendingEmail) return;

    setError(null);
    setSubmitting(true);

    try {
      const { user } = await verifyOtp(pendingEmail, otpCode);
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    if (!pendingEmail) return;

    setError(null);
    try {
      await resendOtp(pendingEmail);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (!pendingEmail) {
    return (
      <p className="text-sm text-foreground/60">
        No signup in progress. Please start from the signup page.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-foreground/60">Enter the code sent to {pendingEmail}</p>

      <div>
        <label htmlFor="otpCode" className="mb-1.5 block text-sm font-medium text-foreground/80">
          Verification code
        </label>
        <div className="relative">
          <input
            id="otpCode"
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            placeholder="000000"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            required
            className="peer w-full rounded-lg border border-secondary bg-card px-4 py-2.5 text-sm tracking-widest text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-success opacity-0 transition peer-valid:opacity-100"
          >
            ✓
          </span>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white shadow-card transition hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Verifying...' : 'Verify'}
      </button>

      <button
        type="button"
        onClick={handleResend}
        className="w-full rounded-lg border border-secondary py-2.5 text-sm font-medium text-foreground/70 transition hover:bg-secondary"
      >
        Resend code
      </button>
    </form>
  );
}
