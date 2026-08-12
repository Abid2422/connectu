import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp, resendOtp } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export default function OtpVerify() {
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { pendingEmail, setUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { user } = await verifyOtp(pendingEmail, otpCode);
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    try {
      await resendOtp(pendingEmail);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!pendingEmail) {
    return <p>No signup in progress. Please start from the signup page.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>Enter the code sent to {pendingEmail}</p>
      <label htmlFor="otpCode">Verification code</label>
      <input
        id="otpCode"
        type="text"
        inputMode="numeric"
        value={otpCode}
        onChange={(e) => setOtpCode(e.target.value)}
        required
      />
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Verifying...' : 'Verify'}
      </button>
      <button type="button" onClick={handleResend}>
        Resend code
      </button>
    </form>
  );
}
