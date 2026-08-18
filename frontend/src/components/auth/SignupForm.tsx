import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { setPendingEmail } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signup(email);
      setPendingEmail(email);
      navigate('/verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="nyuEmail" className="mb-1.5 block text-sm font-medium text-foreground/80">
          NYU email
        </label>
        <input
          id="nyuEmail"
          type="email"
          placeholder="netid@nyu.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-secondary bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
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
        {submitting ? 'Sending...' : 'Send code'}
      </button>
    </form>
  );
}
