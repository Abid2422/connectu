import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { User } from '../api/auth';

interface AuthContextValue {
  pendingEmail: string | null;
  setPendingEmail: Dispatch<SetStateAction<string | null>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Shell state for the signup/verify flow. Session persistence (tokens,
  // logged-in user) is not implemented yet — pending the auth design review.
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const value: AuthContextValue = { pendingEmail, setPendingEmail, user, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
