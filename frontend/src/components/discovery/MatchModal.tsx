import type { User } from '../../api/auth';
import type { Candidate } from '../../api/discovery';
import UserAvatar from '../common/UserAvatar';

interface MatchModalProps {
  currentUser: User;
  matchedUser: Candidate;
  onClose: () => void;
}

// No messaging/chat yet (a later phase) — this is just a confirmation.
export default function MatchModal({ currentUser, matchedUser, onClose }: MatchModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-lg bg-card p-8 text-center shadow-lift">
        <h2 className="font-heading text-2xl font-semibold text-foreground">Nice, you matched!</h2>

        <div className="mt-6 flex items-center justify-center gap-4">
          <UserAvatar
            userId={currentUser.id}
            name={currentUser.name}
            nyuEmail={currentUser.nyuEmail}
            photoUrl={currentUser.avatarUrl}
            size={72}
          />
          <span aria-hidden="true" className="text-2xl text-foreground/40">
            ✓
          </span>
          <UserAvatar userId={matchedUser.id} name={matchedUser.name} photoUrl={matchedUser.avatarUrl} size={72} />
        </div>

        <p className="mt-4 text-sm text-foreground/60">
          You and {matchedUser.name ?? 'this student'} both connected.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white shadow-card transition hover:shadow-lift"
        >
          Keep exploring
        </button>
      </div>
    </div>
  );
}
