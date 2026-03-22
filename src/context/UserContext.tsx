import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { auth as authApi, user as userApi } from '../lib/api';
import type { UserStats, DashboardData } from '../lib/api';

// ── Types ──────────────────────────────────────────────────────

interface UserContextValue {
  userId: string | null;
  userStats: UserStats | null;
  dashboard: DashboardData | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshDashboard: () => Promise<void>;
}

// ── Context ────────────────────────────────────────────────────

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId]       = useState<string | null>(() => localStorage.getItem('mm_user_id'));
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const refreshDashboard = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await userApi.getDashboard(userId);
      setDashboard(data);
      setUserStats(data.user);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Auto-load dashboard when userId is set
  useEffect(() => {
    if (userId) refreshDashboard();
  }, [userId, refreshDashboard]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(email, password);
      localStorage.setItem('mm_user_id', res.user_id);
      setUserId(res.user_id);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register(email, password);
      localStorage.setItem('mm_user_id', res.user_id);
      setUserId(res.user_id);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('mm_user_id');
    setUserId(null);
    setUserStats(null);
    setDashboard(null);
  };

  return (
    <UserContext.Provider value={{ userId, userStats, dashboard, loading, error, login, register, logout, refreshDashboard }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside <UserProvider>');
  return ctx;
}
