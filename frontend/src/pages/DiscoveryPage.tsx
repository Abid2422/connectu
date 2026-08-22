import { Link } from 'react-router-dom';
import UserAvatar from '../components/common/UserAvatar';
import { useAuth } from '../context/AuthContext';

export default function DiscoveryPage() {
  const { user } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-secondary bg-card p-8 shadow-card">
        {user && (
          <Link to="/profile" className="mb-4 inline-block">
            <UserAvatar
              userId={user.id}
              name={user.name}
              nyuEmail={user.nyuEmail}
              photoUrl={user.avatarUrl}
              size={56}
            />
          </Link>
        )}
        <h1 className="font-heading text-2xl font-semibold text-foreground">Discover</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Discovery is coming soon. This page is a placeholder — profile setup is complete!
        </p>
        <Link to="/profile" className="mt-4 inline-block text-sm text-primary hover:underline">
          Edit your photos
        </Link>
      </div>
    </main>
  );
}
