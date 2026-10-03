import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';

/**
 * What the sign-in flow learns about the customer on the way through: the
 * number they verified, and the name they gave if the number had no account.
 */
export type AuthProfile = {
  /** The national number, digits only — "923456789". */
  phoneNumber: string;
  /** Absent when signing in to an account that already has one. */
  name?: string;
};

export type AuthContextValue = {
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Null until a session exists, and again after signing out. */
  profile: AuthProfile | null;
  /**
   * Opens a session. The profile is optional so a caller that only needs the
   * authenticated flag — a test, or a future biometric unlock that restores a
   * stored session — does not have to invent one.
   */
  signIn: (profile?: AuthProfile) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<AuthProfile | null>(null);

  const signIn = useCallback((next?: AuthProfile) => {
    setIsAuthenticated(true);
    if (next) setProfile(next);
  }, []);

  const signOut = useCallback(() => {
    setIsAuthenticated(false);
    setProfile(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, isLoading: false, profile, signIn, signOut }),
    [isAuthenticated, profile, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
