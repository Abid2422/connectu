import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { getDiscoverCandidates, submitSwipe, type Candidate, type DiscoverFilters } from '../api/discovery';
import { useAuth } from '../context/AuthContext';
import UserAvatar from '../components/common/UserAvatar';
import CandidateCard from '../components/discovery/CandidateCard';
import MatchModal from '../components/discovery/MatchModal';

export default function DiscoveryPage() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swiping, setSwiping] = useState(false);
  const [matchedCandidate, setMatchedCandidate] = useState<Candidate | null>(null);
  const [majorFilter, setMajorFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const loadCandidates = useCallback(async (filters: DiscoverFilters) => {
    setLoading(true);
    setError(null);
    try {
      const results = await getDiscoverCandidates(filters);
      setCandidates(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCandidates({});
  }, [loadCandidates]);

  function handleApplyFilters(e: FormEvent) {
    e.preventDefault();
    loadCandidates({ major: majorFilter.trim(), year: yearFilter.trim() });
  }

  const current = candidates[0];

  async function handleSwipe(direction: 'like' | 'pass') {
    if (!current || swiping) return;

    setSwiping(true);
    setError(null);
    try {
      const matched = await submitSwipe(current.id, direction);
      setCandidates((prev) => prev.slice(1));
      if (matched) {
        setMatchedCandidate(current);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSwiping(false);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-background px-4 py-12">
      <div className="mb-6 flex w-full max-w-md items-center justify-between">
        {user && (
          <Link to="/profile" aria-label="Edit your profile">
            <UserAvatar
              userId={user.id}
              name={user.name}
              nyuEmail={user.nyuEmail}
              photoUrl={user.avatarUrl}
              size={40}
            />
          </Link>
        )}
        <h1 className="font-heading text-xl font-semibold text-foreground">Discover</h1>
        <div className="w-10" aria-hidden="true" />
      </div>

      <form onSubmit={handleApplyFilters} className="mb-6 flex w-full max-w-md gap-2">
        <input
          type="text"
          placeholder="Filter by major"
          value={majorFilter}
          onChange={(e) => setMajorFilter(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-secondary bg-card px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
        <input
          type="text"
          placeholder="Filter by year"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-secondary bg-card px-3 py-2 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg border border-secondary px-3 py-2 text-sm font-medium text-foreground/70 transition hover:bg-secondary"
        >
          Apply
        </button>
      </form>

      {error && (
        <p role="alert" className="mb-4 w-full max-w-md rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-foreground/60">Loading...</p>
      ) : current ? (
        <>
          <CandidateCard candidate={current} />
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => handleSwipe('pass')}
              disabled={swiping}
              aria-label="Pass"
              className="flex h-14 w-14 items-center justify-center rounded-full border border-secondary bg-card text-xl text-foreground/60 shadow-card transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              ✕
            </button>
            <button
              type="button"
              onClick={() => handleSwipe('like')}
              disabled={swiping}
              aria-label="Connect"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl text-white shadow-card transition hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60"
            >
              ✓
            </button>
          </div>
        </>
      ) : (
        <div className="w-full max-w-md rounded-lg border border-secondary bg-card p-8 text-center shadow-card">
          <p className="text-sm text-foreground/60">
            No more candidates right now — check back later or try different filters.
          </p>
        </div>
      )}

      {matchedCandidate && user && (
        <MatchModal currentUser={user} matchedUser={matchedCandidate} onClose={() => setMatchedCandidate(null)} />
      )}
    </main>
  );
}
