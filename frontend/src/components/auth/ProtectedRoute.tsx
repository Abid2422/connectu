import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  // False for pages a logged-in user should reach regardless of onboarding
  // status — namely /profile-setup itself, to avoid redirecting it to itself.
  requireOnboarding?: boolean;
}

export default function ProtectedRoute({ children, requireOnboarding = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-foreground/60">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  if (requireOnboarding && !user.onboardingComplete) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <>{children}</>;
}
