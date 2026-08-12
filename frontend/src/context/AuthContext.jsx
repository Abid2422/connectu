import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Shell state for the signup/verify flow. Session persistence (tokens,
  // logged-in user) is not implemented yet — pending the auth design review.
  const [pendingEmail, setPendingEmail] = useState(null);
  const [user, setUser] = useState(null);

  const value = { pendingEmail, setPendingEmail, user, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
