import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateMe } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

// No canonical taxonomy exists yet for year/campus/looking-for — these are
// reasonable NYU-flavored defaults, not a spec'd list. Revisit if there's
// an official set to match.
const YEAR_OPTIONS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate Student'];
const CAMPUS_OPTIONS = ['Washington Square', 'Brooklyn', 'Abu Dhabi', 'Shanghai', 'Other'];
const LOOKING_FOR_OPTIONS = ['Friends', 'Study Partner', 'Networking', 'Dating', 'Roommate'];

// Mirrors backend/src/middleware/validate.middleware.ts's constants.
const MAX_SHORT_FIELD_LENGTH = 100;
const MAX_TAG_LENGTH = 40;
const INTERESTS_MIN = 3;
const INTERESTS_MAX = 8;
const LOOKING_FOR_MIN = 1;
const LOOKING_FOR_MAX = 4;
const BIO_MIN = 20;
const BIO_MAX = 300;

export default function ProfileSetupForm() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const needsName = !user?.name;

  const [name, setName] = useState('');
  const [major, setMajor] = useState(user?.major ?? '');
  const [year, setYear] = useState(user?.year ?? '');
  const [campus, setCampus] = useState(user?.campus ?? '');
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [interestInput, setInterestInput] = useState('');
  const [lookingFor, setLookingFor] = useState<string[]>(user?.lookingFor ?? []);
  const [bio, setBio] = useState(user?.bio ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function addInterest() {
    const value = interestInput.trim();
    if (!value || interests.length >= INTERESTS_MAX) return;
    if (interests.some((interest) => interest.toLowerCase() === value.toLowerCase())) {
      setInterestInput('');
      return;
    }
    setInterests([...interests, value]);
    setInterestInput('');
  }

  function handleInterestKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addInterest();
    }
  }

  function removeInterest(value: string) {
    setInterests(interests.filter((interest) => interest !== value));
  }

  function toggleLookingFor(option: string) {
    if (lookingFor.includes(option)) {
      setLookingFor(lookingFor.filter((item) => item !== option));
    } else if (lookingFor.length < LOOKING_FOR_MAX) {
      setLookingFor([...lookingFor, option]);
    }
  }

  const trimmedBio = bio.trim();
  const isValid =
    (!needsName || name.trim().length > 0) &&
    major.trim().length > 0 &&
    year.trim().length > 0 &&
    campus.trim().length > 0 &&
    interests.length >= INTERESTS_MIN &&
    interests.length <= INTERESTS_MAX &&
    lookingFor.length >= LOOKING_FOR_MIN &&
    lookingFor.length <= LOOKING_FOR_MAX &&
    trimmedBio.length >= BIO_MIN &&
    trimmedBio.length <= BIO_MAX;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) return;

    setError(null);
    setSubmitting(true);

    try {
      const updatedUser = await updateMe({
        ...(needsName ? { name: name.trim() } : {}),
        major: major.trim(),
        year,
        campus,
        interests,
        lookingFor,
        bio: trimmedBio,
      });
      setUser(updatedUser);
      navigate('/discovery');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {needsName && (
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground/80">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Jane Violet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={MAX_SHORT_FIELD_LENGTH}
            required
            className="w-full rounded-lg border border-secondary bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
          />
        </div>
      )}

      <div>
        <label htmlFor="major" className="mb-1.5 block text-sm font-medium text-foreground/80">
          Major
        </label>
        <input
          id="major"
          type="text"
          placeholder="Computer Science"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          maxLength={MAX_SHORT_FIELD_LENGTH}
          required
          className="w-full rounded-lg border border-secondary bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div>
        <label htmlFor="year" className="mb-1.5 block text-sm font-medium text-foreground/80">
          Year
        </label>
        <select
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
          className="w-full rounded-lg border border-secondary bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        >
          <option value="" disabled>
            Select your year
          </option>
          {YEAR_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="campus" className="mb-1.5 block text-sm font-medium text-foreground/80">
          Campus
        </label>
        <select
          id="campus"
          value={campus}
          onChange={(e) => setCampus(e.target.value)}
          required
          className="w-full rounded-lg border border-secondary bg-card px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        >
          <option value="" disabled>
            Select your campus
          </option>
          {CAMPUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="interestInput" className="mb-1.5 block text-sm font-medium text-foreground/80">
          Interests
        </label>
        <input
          id="interestInput"
          type="text"
          placeholder="Type an interest and press Enter"
          value={interestInput}
          onChange={(e) => setInterestInput(e.target.value)}
          onKeyDown={handleInterestKeyDown}
          maxLength={MAX_TAG_LENGTH}
          disabled={interests.length >= INTERESTS_MAX}
          className="w-full rounded-lg border border-secondary bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
        />
        {interests.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span
                key={interest}
                className="flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  aria-label={`Remove ${interest}`}
                  className="text-foreground/50 hover:text-foreground"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <p className="mt-1.5 text-xs text-foreground/50">
          {interests.length}/{INTERESTS_MAX} added — at least {INTERESTS_MIN} required
        </p>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-foreground/80">Looking for</span>
        <div className="flex flex-wrap gap-2">
          {LOOKING_FOR_OPTIONS.map((option) => {
            const selected = lookingFor.includes(option);
            const disabled = !selected && lookingFor.length >= LOOKING_FOR_MAX;
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleLookingFor(option)}
                disabled={disabled}
                aria-pressed={selected}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  selected
                    ? 'border-primary bg-primary text-white'
                    : 'border-secondary bg-card text-foreground/70 hover:bg-secondary'
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-xs text-foreground/50">
          Select {LOOKING_FOR_MIN}-{LOOKING_FOR_MAX}
        </p>
      </div>

      <div>
        <label htmlFor="bio" className="mb-1.5 block text-sm font-medium text-foreground/80">
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          placeholder="Tell people a bit about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={BIO_MAX}
          required
          className="w-full resize-none rounded-lg border border-secondary bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/40 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/40"
        />
        <p className="mt-1.5 text-xs text-foreground/50">
          {bio.length}/{BIO_MAX}
          {trimmedBio.length < BIO_MIN ? ` — ${BIO_MIN - trimmedBio.length} more characters needed` : ''}
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !isValid}
        className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white shadow-card transition hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? 'Saving...' : 'Save and continue'}
      </button>
    </form>
  );
}
