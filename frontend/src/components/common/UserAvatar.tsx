interface UserAvatarProps {
  userId: string;
  name?: string | null;
  nyuEmail?: string | null;
  // Not populated by any current API — accepted now so call sites don't
  // need to change once photo upload (a later branch) adds this field.
  photoUrl?: string | null;
  size?: number;
  className?: string;
}

// FNV-1a-ish string hash — good enough for a deterministic, evenly spread
// avatar color, not for anything security-sensitive.
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name?: string | null, nyuEmail?: string | null): string {
  const trimmedName = name?.trim();
  if (trimmedName) {
    const parts = trimmedName.split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
  }

  if (nyuEmail) {
    return nyuEmail[0]?.toUpperCase() ?? '?';
  }

  return '?';
}

function getGradient(userId: string): string {
  const hash = hashString(userId);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 60) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 55%), hsl(${hue2}, 70%, 45%))`;
}

// Anywhere a profile photo would show: renders it if present, otherwise
// falls back to a deterministic gradient + initials derived from userId.
export default function UserAvatar({
  userId,
  name,
  nyuEmail,
  photoUrl,
  size = 40,
  className = '',
}: UserAvatarProps) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name ? `${name}'s profile photo` : 'Profile photo'}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={name ? `${name}'s avatar` : 'User avatar'}
      className={`flex shrink-0 items-center justify-center rounded-full font-heading font-medium text-white ${className}`}
      style={{ width: size, height: size, background: getGradient(userId), fontSize: size * 0.4 }}
    >
      {getInitials(name, nyuEmail)}
    </div>
  );
}
