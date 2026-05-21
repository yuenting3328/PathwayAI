const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';

function getToken(): string | null {
  return localStorage.getItem('pathwayai_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
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
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export const auth = {
  login: (email: string, password: string) =>
    api.post<{ token: string; refreshToken: string }>('/auth/login', { email, password }),
  me: () => api.get<{ id: string; email: string; role: string; companyName?: string }>('/auth/me'),
};

// Jobs posted by this recruiter — flow to App's JobsDiscoveryScreen
export const jobs = {
  list: () => api.get<RecruiterJob[]>('/recruiters/jobs'),
  create: (data: Omit<RecruiterJob, 'id' | 'applicantCount' | 'status'>) =>
    api.post<RecruiterJob>('/recruiters/jobs', data),
  update: (id: string, data: Partial<RecruiterJob>) =>
    api.patch<RecruiterJob>(`/recruiters/jobs/${id}`, data),
  close: (id: string) => api.delete<{ success: boolean }>(`/recruiters/jobs/${id}`),
};

// Candidates who applied to this recruiter's jobs — sourced from App applications
export const candidates = {
  list: (jobId?: string) => {
    const q = jobId ? `?jobId=${jobId}` : '';
    return api.get<CandidateApplication[]>(`/recruiters/candidates${q}`);
  },
  get: (id: string) => api.get<CandidateDetail>(`/recruiters/candidates/${id}`),
  updateStatus: (id: string, status: CandidateApplication['status']) =>
    api.patch<CandidateApplication>(`/recruiters/candidates/${id}`, { status }),
};

// Competency feedback — writes to Institution's /market/competency-feedback
export const competency = {
  list: () => api.get<CompetencyFeedback[]>('/market/competency-feedback'),
  submit: (data: { competency: string; current: number; desired: number }) =>
    api.post<CompetencyFeedback>('/market/competency-feedback', {
      ...data,
      gap: data.desired - data.current,
    }),
};

// Campus events — feeds App notifications + Institution EmployerEvent metrics
export const events = {
  list: () => api.get<CampusEvent[]>('/recruiters/events'),
  create: (data: Omit<CampusEvent, 'id'>) =>
    api.post<CampusEvent>('/recruiters/events', data),
};

// Dashboard analytics
export const analytics = {
  overview: () => api.get<RecruiterAnalytics>('/recruiters/analytics'),
};

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

// Types

export interface RecruiterJob {
  id: string;
  title: string;
  sector: string;
  district: string;
  salaryMin: number;
  salaryMax: number;
  deadline: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  applicantCount: number;
  description?: string;
  skills: string[];
}

export interface CandidateApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEWING' | 'OFFERED' | 'REJECTED';
  appliedDate: string;
  graduate: {
    userId: string;
    name: string;
    university: string;
    faculty?: string;
    graduationYear?: number;
    matchScore: number;
  };
}

export interface CandidateDetail extends CandidateApplication {
  graduate: CandidateApplication['graduate'] & {
    skills: { name: string; level: number }[];
    credentials: { name: string; type: string; status: string; issuer: string }[];
    gpa?: number;
    bio?: string;
  };
}

export interface CompetencyFeedback {
  id: string;
  competency: string;
  current: number;
  desired: number;
  gap: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  type: 'CAREER_FAIR' | 'WORKSHOP' | 'NETWORKING' | 'INFO_SESSION';
  date: string;
  time: string;
  location: string;
  universityPartner: string;
  expectedAttendance: number;
  description?: string;
}

export interface RecruiterAnalytics {
  activeJobs: number;
  totalApplications: number;
  shortlisted: number;
  offersMade: number;
  avgTimeToHire: number;
  topUniversity: string;
  pipelineTrend: { month: string; applications: number; shortlisted: number; offers: number }[];
  sectorBreakdown: { sector: string; count: number }[];
}
