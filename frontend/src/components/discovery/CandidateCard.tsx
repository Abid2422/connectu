import type { Candidate } from '../../api/discovery';
import UserAvatar from '../common/UserAvatar';

interface CandidateCardProps {
  candidate: Candidate;
}

export default function CandidateCard({ candidate }: CandidateCardProps) {
  const subtitle = [candidate.major, candidate.year].filter(Boolean).join(' · ');

  return (
    <div className="w-full max-w-md rounded-lg border border-secondary bg-card p-8 shadow-card">
      <div className="flex flex-col items-center text-center">
        <UserAvatar userId={candidate.id} name={candidate.name} photoUrl={candidate.avatarUrl} size={96} />
        <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
          {candidate.name ?? 'ConnectU student'}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-foreground/60">{subtitle}</p>}
        {candidate.campus && <p className="text-xs text-foreground/50">{candidate.campus}</p>}
      </div>

      {candidate.interests.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {candidate.interests.map((interest) => (
            <span key={interest} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-foreground">
              {interest}
            </span>
          ))}
        </div>
      )}

      {candidate.bio && <p className="mt-5 text-sm leading-relaxed text-foreground/80">{candidate.bio}</p>}
    </div>
  );
}
