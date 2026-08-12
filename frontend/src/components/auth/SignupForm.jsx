import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { setPendingEmail } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signup(email);
      setPendingEmail(email);
      navigate('/verify');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="nyuEmail">NYU email</label>
      <input
        id="nyuEmail"
        type="email"
        placeholder="netid@nyu.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send code'}
      </button>
    </form>
  );
}
