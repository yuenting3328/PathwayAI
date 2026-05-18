import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth, saveTokens, clearTokens, isLoggedIn, type User, type Profile } from '../lib/api';

interface AuthState {
  user: (User & { profile: Profile | null }) | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(User & { profile: Profile | null }) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn()) {
      auth.me()
        .then(setUser)
        .catch(() => clearTokens())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token, refreshToken } = await auth.login(email, password);
    saveTokens(token, refreshToken);
    const full = await auth.me();
    setUser(full);
  };

  const register = async (email: string, password: string) => {
    const { token, refreshToken } = await auth.register(email, password);
    saveTokens(token, refreshToken);
    const full = await auth.me();
    setUser(full);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const refreshUser = async () => {
    const full = await auth.me();
    setUser(full);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
