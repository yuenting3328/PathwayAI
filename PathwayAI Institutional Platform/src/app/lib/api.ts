const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1';

function getToken(): string | null {
  return localStorage.getItem('pathwayai_token');
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
};

// Auth
export const auth = {
  login: (email: string, password: string) =>
    api.post<{ token: string; refreshToken: string }>('/auth/login', { email, password }),
  me: () => api.get<{ id: string; email: string; role: string; profile: Profile | null; institutionId?: string }>('/auth/me'),
};

// Institution admin endpoints
export const institution = {
  outcomes: (params?: Record<string, string | number>) => {
    const q = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return api.get<GraduateOutcome[]>(`/institution/outcomes${q}`);
  },
  programmes: () => api.get<Programme[]>('/institution/programmes'),
  credentials: () => api.get<IssuedCredential[]>('/institution/credentials'),
  issueCredential: (data: { recipientRef: string; type: string; name: string }) =>
    api.post<IssuedCredential>('/institution/credentials', data),
};

// Analytics
export const analytics = {
  institution: () => api.get<InstitutionAnalytics>('/analytics/institution'),
};

// Employer relationships
export const employers = {
  partnerships: () => api.get<EmployerRelationship[]>('/employers/partnerships'),
  list: () => api.get<Employer[]>('/employers'),
};

// Market
export const market = {
  signals: () => api.get<MarketSignal[]>('/market/signals'),
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

// Types
export interface Profile {
  name?: string;
  university?: string;
}

export interface GraduateOutcome {
  id: string;
  cohortRef: string;
  cohortYear: number;
  sector?: string;
  role?: string;
  company?: string;
  salaryBand?: string;
  timeToOfferDays?: number;
  geography?: string;
  programme?: { name: string; faculty: string };
}

export interface Programme {
  id: string;
  name: string;
  faculty: string;
  degreeLevel: string;
  employmentRate: number;
  avgSalary: number;
  timeToOffer: number;
  satisfaction: number;
}

export interface IssuedCredential {
  id: string;
  recipientRef: string;
  type: string;
  name: string;
  status: 'PENDING' | 'VERIFIED' | 'EXPIRED';
  issuedAt?: string;
  createdAt: string;
}

export interface InstitutionAnalytics {
  employmentRate: number;
  totalGraduates: number;
  credentialsIssued: number;
  credentialsPending: number;
  employerPartners: number;
  totalJobPostings: number;
  totalPlacements: number;
  sectorBreakdown: Record<string, number>;
}

export interface EmployerRelationship {
  id: string;
  tier: string;
  jobPostings: number;
  internships: number;
  placements: number;
  employer: { id: string; name: string; sector?: string; logoUrl?: string };
}

export interface Employer {
  id: string;
  name: string;
  sector?: string;
  district?: string;
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
}

export interface SalaryBenchmark {
  sector: string;
  avgMin: number;
  avgMax: number;
}
