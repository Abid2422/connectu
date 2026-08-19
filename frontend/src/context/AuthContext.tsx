import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { getMe, type User } from '../api/auth';

interface AuthContextValue {
  pendingEmail: string | null;
  setPendingEmail: Dispatch<SetStateAction<string | null>>;
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  // True until the initial /me check resolves. Route guards must wait for
  // this before redirecting, otherwise a logged-in user on refresh would
  // briefly bounce to /signup before the session check comes back.
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const value: AuthContextValue = { pendingEmail, setPendingEmail, user, setUser, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
