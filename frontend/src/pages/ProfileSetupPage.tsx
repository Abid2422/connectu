import ProfileSetupForm from '../components/auth/ProfileSetupForm';
import UserAvatar from '../components/common/UserAvatar';
import { useAuth } from '../context/AuthContext';

export default function ProfileSetupPage() {
  const { user } = useAuth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-secondary bg-card p-8 shadow-card">
        {user && (
          <UserAvatar
            userId={user.id}
            name={user.name}
            nyuEmail={user.nyuEmail}
            photoUrl={user.avatarUrl}
            size={56}
            className="mb-4"
          />
        )}
        <h1 className="font-heading text-2xl font-semibold text-foreground">Complete your profile</h1>
        <p className="mt-2 text-sm text-foreground/60">
          Tell us a bit about yourself so other students can find you.
        </p>
        <div className="mt-6">
          <ProfileSetupForm />
        </div>
      </div>
    </main>
  );
}
