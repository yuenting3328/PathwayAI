export const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';

export function getToken(): string | null {
  return localStorage.getItem('pathwayai_token');
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw Object.assign(new Error(err.error ?? 'Request failed'), { status: res.status });
  }

  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

// Auth helpers
export const auth = {
  login: (email: string, password: string) =>
    api.post<{ token: string; refreshToken: string; user: User }>('/auth/login', { email, password }),
  register: (email: string, password: string) =>
    api.post<{ token: string; refreshToken: string; user: User }>('/auth/register', { email, password }),
  me: () => api.get<User & { profile: Profile | null }>('/auth/me'),
  updateProfile: (data: Partial<Profile>) => api.patch<Profile>('/auth/me/profile', data),
};

// Jobs
export const jobs = {
  list: (params?: Record<string, string | number>) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return api.get<{ data: Job[]; total: number }>(`/jobs${q}`);
  },
  get: (id: string) => api.get<Job>(`/jobs/${id}`),
  toggleSave: (id: string) => api.post<{ saved: boolean }>(`/jobs/${id}/save`, {}),
};

// Applications
export const applications = {
  list: () => api.get<Application[]>('/applications'),
  stats: () => api.get<AppStats>('/applications/stats'),
  apply: (jobId: string, notes?: string) =>
    api.post<Application>('/applications', { jobId, notes }),
  update: (id: string, data: Partial<Application>) =>
    api.patch<Application>(`/applications/${id}`, data),
  withdraw: (id: string) => api.delete<{ success: boolean }>(`/applications/${id}`),
};

// Skills
export const skills = {
  list: () => api.get<UserSkill[]>('/skills'),
  gaps: () => api.get<SkillGap[]>('/skills/gaps'),
  update: (skillId: string, level: number) =>
    api.put<UserSkill>(`/skills/${skillId}`, { level }),
};

// Credentials
export const credentials = {
  list: () => api.get<Credential[]>('/credentials'),
  submit: (data: { category: string; name: string; issuer: string; fileUrl?: string }) =>
    api.post<Credential>('/credentials', data),
};

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface CoachHealth {
  model: string;
  apiKeyConfigured: boolean;
  mode: 'live' | 'mock';
}

// Coaching
export const coaching = {
  sessions: () => api.get<CoachSession[]>('/coach/sessions'),
  stats: () => api.get<CoachStats>('/coach/sessions/stats'),
  record: (data: { type: string; topic?: string; score?: number; summary?: string; durationMs?: number }) =>
    api.post<CoachSession>('/coach/sessions', data),
  chat: (messages: { role: 'user' | 'assistant'; content: string }[]) =>
    api.post<{ content: string }>('/coach/chat', { messages }),
  messages: () => api.get<ChatMessage[]>('/coach/messages'),
  clearMessages: () => api.delete<{ success: boolean }>('/coach/messages'),
  health: () => api.get<CoachHealth>('/coach/health'),
};

// Programmes
export const programmes = {
  list: () => api.get<GraduateProgramme[]>('/programmes'),
  alumniPaths: () => api.get<AlumniPath[]>('/programmes/alumni-paths'),
};

// Analytics
export const analytics = {
  me: () => api.get<StudentAnalytics>('/analytics/me'),
  cohort: () => api.get<CohortStats>('/analytics/cohort'),
};

// Market
export const market = {
  signals: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get<MarketSignal[]>(`/market/signals${q}`);
  },
  signal: (id: string) => api.get<MarketSignal>(`/market/signals/${id}`),
  salary: () => api.get<SalaryBenchmark[]>('/market/salary'),
};

// Token management
export function saveTokens(token: string, refreshToken: string) {
  localStorage.setItem('pathwayai_token', token);
  localStorage.setItem('pathwayai_refresh_token', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('pathwayai_token');
  localStorage.removeItem('pathwayai_refresh_token');
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

// Types matching backend schema
export interface User {
  id: string;
  email: string;
  role: 'GRADUATE' | 'ADVISOR' | 'INSTITUTION_ADMIN' | 'SUPER_ADMIN';
}

export interface Profile {
  id: string;
  userId: string;
  name?: string;
  university?: string;
  faculty?: string;
  degreeLevel?: string;
  studyMode?: string;
  graduationYear?: number;
  targetRole?: string;
  targetSector?: string;
  gpa?: number;
  location?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  district: string;
  salaryMin: number;
  salaryMax: number;
  responsibilities: string;
  requirements: string;
  skills: string[];
  sector?: string;
  deadline?: string;
  saved: boolean;
  skillsMatch: { have: number; total: number };
  matchScore: number;
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'PENDING' | 'INTERVIEW' | 'OFFERED' | 'REJECTED' | 'WITHDRAWN';
  stage: string;
  appliedDate: string;
  interviewDate?: string;
  notes?: string;
  job?: { title: string; company: string; district: string; sector?: string };
}

export interface AppStats {
  total: number;
  pending: number;
  interviews: number;
  offers: number;
  rejected: number;
}

export interface UserSkill {
  id: string;
  skillId: string;
  name: string;
  category?: string;
  level: number;
  gap: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SkillGap {
  name: string;
  jobCount: number;
}

export interface Credential {
  id: string;
  category: string;
  name: string;
  issuer: string;
  status: 'PENDING' | 'VERIFIED' | 'EXPIRED';
  issuedDate?: string;
  fileUrl?: string;
}

export interface CoachSession {
  id: string;
  type: string;
  topic?: string;
  summary?: string;
  score?: number;
  createdAt: string;
}

export interface CoachStats {
  total: number;
  interviewPractice: number;
  avgScore: number | null;
}

export interface GraduateProgramme {
  id: string;
  name: string;
  logo?: string;
  deadline?: string;
  salaryMin?: number;
  salaryMax?: number;
  successRate: number;
  sector?: string;
  location?: string;
  description?: string;
  employer: { name: string; sector?: string };
}

export interface AlumniPath {
  id: string;
  name: string;
  typicalRoles: string[];
  timeToTransition: string;
  description?: string;
}

export interface StudentAnalytics {
  applications: number;
  interviews: number;
  offers: number;
  conversionRate: number;
  coachSessions: number;
  avgSkillLevel: number;
  matchScoreTrend: number[];
}

export interface CohortStats {
  myConversionRate: number;
  cohortAvgRate: number;
  comparison: 'above' | 'below';
}

export interface MarketSignal {
  id: string;
  title: string;
  description?: string;
  trend: 'UP' | 'DOWN' | 'STABLE' | 'HOT';
  salaryMin?: number;
  salaryMax?: number;
  sector?: string;
  district?: string;
  role?: string;
}

export interface SalaryBenchmark {
  sector: string;
  avgMin: number;
  avgMax: number;
}
