// ══════════════════════════════════════════════════════════════
//  MentorMind AI — Frontend API Client (TypeScript)
//  Base URL: set VITE_API_URL in your .env
// ══════════════════════════════════════════════════════════════

const BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

// ── Types ──────────────────────────────────────────────────────

export interface AuthResponse {
  user_id: string;
  email: string;
  message: string;
}

export interface UserStats {
  user_id: string;
  email: string;
  ques_attempted: number;
  ques_mastered: number;
  completed_sessions: number;
  current_streak: number;
  hint_dependency_score: number;
  avg_delete_ratio: number;
  leaderboard_rank: number | null;
}

export interface UpdateStatsPayload {
  ques_attempted?: number;
  ques_mastered?: number;
  completed_sessions?: number;
  current_streak?: number;
  hint_dependency_score?: number;
  avg_delete_ratio?: number;
  leaderboard_rank?: number;
}

export interface Session {
  session_id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  problems_done: number;
  hints_used: number;
  deletes_made: number;
  topic: string | null;
}

export interface EndSessionPayload {
  problems_done?: number;
  hints_used?: number;
  deletes_made?: number;
}

export interface WeakArea {
  id: number;
  user_id: string;
  topic: string;
  score: number;
  attempts: number;
  last_seen: string;
}

export interface WeakAreaInput {
  topic: string;
  score: number;
  attempts?: number;
}

export interface GapAnalysis {
  id: number;
  user_id: string;
  generated_at: string;
  insight: string;
  recommended_topics: string[];
  is_active: boolean;
}

export interface BehavioralFlag {
  id: number;
  user_id: string;
  flag: string;
  severity: 'low' | 'medium' | 'high';
  flagged_at: string;
}

export interface FrequentBug {
  id: number;
  user_id: string;
  bug_type: string;
  occurrences: number;
  last_seen: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  email: string;
  ques_mastered: number;
  current_streak: number;
}

export interface DashboardData {
  user: UserStats;
  weak_areas: WeakArea[];
  gap_analysis: GapAnalysis | null;
  behavioral_flags: BehavioralFlag[];
  most_frequent_bug: FrequentBug | null;
  recent_sessions: Session[];
}

// ── Core fetch ─────────────────────────────────────────────────

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body !== undefined) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  if (res.status === 204) return null as T;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? 'API error');
  }
  return res.json() as Promise<T>;
}

const get  = <T>(path: string)               => request<T>('GET',    path);
const post = <T>(path: string, body?: unknown) => request<T>('POST',   path, body);
const put  = <T>(path: string, body?: unknown) => request<T>('PUT',    path, body);
const del  = <T>(path: string)               => request<T>('DELETE', path);

// ── Auth ───────────────────────────────────────────────────────

export const auth = {
  register: (email: string, password: string) =>
    post<AuthResponse>('/api/auth/register', { email, password }),
  login: (email: string, password: string) =>
    post<AuthResponse>('/api/auth/login', { email, password }),
};

// ── User ───────────────────────────────────────────────────────

export const user = {
  getProfile: (userId: string) =>
    get<UserStats>(`/api/user/${userId}`),
  updateStats: (userId: string, fields: UpdateStatsPayload) =>
    put<UserStats>(`/api/user/${userId}/stats`, fields),
  getDashboard: (userId: string) =>
    get<DashboardData>(`/api/user/${userId}/dashboard`),
};

// ── Progress ───────────────────────────────────────────────────

export const progress = {
  startSession: (userId: string, topic: string | null = null) =>
    post<Session>('/api/progress/sessions/start', { user_id: userId, topic }),
  endSession: (sessionId: string, data: EndSessionPayload = {}) =>
    put<Session>(`/api/progress/sessions/${sessionId}/end`, { problems_done: 0, hints_used: 0, deletes_made: 0, ...data }),
  getSessions: (userId: string) =>
    get<Session[]>(`/api/progress/sessions/${userId}`),
  getRecentSessions: (userId: string, days = 7) =>
    get<Session[]>(`/api/progress/sessions/${userId}/recent?days=${days}`),
  updateStreak: (userId: string, streak: number) =>
    post<{ user_id: string; current_streak: number }>(`/api/progress/streak/${userId}?streak=${streak}`),
};

// ── Weak Areas ─────────────────────────────────────────────────

export const weakAreas = {
  getAll: (userId: string) =>
    get<WeakArea[]>(`/api/analytics/weak-areas/${userId}`),
  upsert: (userId: string, topic: string, score: number, attempts = 1) =>
    post<WeakArea>('/api/analytics/weak-areas', { user_id: userId, topic, score, attempts }),
  upsertBulk: (userId: string, areas: WeakAreaInput[]) =>
    post<WeakArea[]>('/api/analytics/weak-areas/bulk', {
      user_id: userId,
      areas: areas.map((a) => ({ user_id: userId, attempts: 1, ...a })),
    }),
  delete: (userId: string, topic: string) =>
    del<null>(`/api/analytics/weak-areas/${userId}/${encodeURIComponent(topic)}`),
};

// ── Gap Analysis ───────────────────────────────────────────────

export const gapAnalysis = {
  getActive: (userId: string) =>
    get<GapAnalysis>(`/api/analytics/gap-analysis/${userId}`),
  create: (userId: string, insight: string, recommendedTopics: string[] = []) =>
    post<GapAnalysis>('/api/analytics/gap-analysis', {
      user_id: userId,
      insight,
      recommended_topics: recommendedTopics,
    }),
  getHistory: (userId: string) =>
    get<GapAnalysis[]>(`/api/analytics/gap-analysis/${userId}/history`),
};

// ── Behavioral Flags ───────────────────────────────────────────

export const behavioralFlags = {
  getAll: (userId: string) =>
    get<BehavioralFlag[]>(`/api/analytics/flags/${userId}`),
  add: (userId: string, flag: string, severity: 'low' | 'medium' | 'high' = 'low') =>
    post<BehavioralFlag>('/api/analytics/flags', { user_id: userId, flag, severity }),
  delete: (flagId: number) =>
    del<null>(`/api/analytics/flags/${flagId}`),
};

// ── Frequent Bugs ──────────────────────────────────────────────

export const frequentBugs = {
  getAll: (userId: string) =>
    get<FrequentBug[]>(`/api/analytics/bugs/${userId}`),
  record: (userId: string, bugType: string) =>
    post<FrequentBug>('/api/analytics/bugs', { user_id: userId, bug_type: bugType }),
  delete: (userId: string, bugType: string) =>
    del<null>(`/api/analytics/bugs/${userId}/${encodeURIComponent(bugType)}`),
};

// ── Hint Score ─────────────────────────────────────────────────

export const hintScore = {
  update: (userId: string, score: number) =>
    post<{ user_id: string; hint_dependency_score: number }>(
      `/api/analytics/hint-score/${userId}?score=${score}`,
    ),
};

// ── Leaderboard ────────────────────────────────────────────────

export const leaderboard = {
  getTop: (limit = 50) =>
    get<LeaderboardEntry[]>(`/api/leaderboard/?limit=${limit}`),
  recalculate: () =>
    post<{ message: string }>('/api/leaderboard/recalculate'),
};

// ── Health ─────────────────────────────────────────────────────

export const health = {
  check: () => get<{ status: string; db: string }>('/health'),
};

const api = { auth, user, progress, weakAreas, gapAnalysis, behavioralFlags, frequentBugs, hintScore, leaderboard, health };
export default api;
