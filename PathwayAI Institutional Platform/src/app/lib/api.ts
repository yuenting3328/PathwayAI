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
  issueCredential: (data: { recipientRef: string; graduateUserId?: string; type: string; name: string }) =>
    api.post<IssuedCredential>('/institution/credentials', data),
  snapshots: () => api.get<InstitutionSnapshot[]>('/institution/snapshots'),
  programmeSnapshots: () => api.get<ProgrammeSnapshot[]>('/institution/programme-snapshots'),
  insights: () => api.get<InstitutionInsight[]>('/institution/insights'),
  careerStages: () => api.get<AlumniCareerStage[]>('/institution/career-stages'),
  salaryStages: () => api.get<AlumniSalaryStage[]>('/institution/salary-stages'),
  engagement: () => api.get<AlumniEngagement[]>('/institution/engagement'),
  coachingMetrics: () => api.get<CoachingWeekMetric[]>('/institution/coaching-metrics'),
};

// Graduate lookup — used by Institution when issuing credentials
export const graduates = {
  search: (q: string) =>
    api.get<GraduateSearchResult[]>(`/institution/graduates/search?q=${encodeURIComponent(q)}`),
};

// Analytics
export const analytics = {
  institution: () => api.get<InstitutionAnalytics>('/analytics/institution'),
};

// Employer relationships
export const employers = {
  partnerships: () => api.get<EmployerRelationship[]>('/employers/partnerships'),
  list: () => api.get<Employer[]>('/employers'),
  pipeline: () => api.get<PartnershipPipeline[]>('/employers/pipeline'),
  satisfactionTrends: () => api.get<EmployerSatisfactionTrend[]>('/employers/satisfaction-trends'),
  events: () => api.get<EmployerEvent[]>('/employers/events'),
  activity: () => api.get<PartnershipActivity[]>('/employers/activity'),
  sectorDistribution: () => api.get<SectorCount[]>('/employers/sector-distribution'),
  talentHub: () => api.get<TalentHubMetric[]>('/employers/talent-hub'),
};

// Market
export const market = {
  signals: () => api.get<MarketSignal[]>('/market/signals'),
  salary: () => api.get<SalaryBenchmark[]>('/market/salary'),
  sectorTrends: () => api.get<SectorTrend[]>('/market/sector-trends'),
  districtSalaries: () => api.get<DistrictSalaryBenchmark[]>('/market/district-salaries'),
  skillsShortage: () => api.get<SkillShortage[]>('/market/skills-shortage'),
  competencyFeedback: () => api.get<CompetencyFeedback[]>('/market/competency-feedback'),
  demandForecast: () => api.get<DemandForecast[]>('/market/demand-forecast'),
  topEmployers: () => api.get<TopEmployer[]>('/market/top-employers'),
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

export interface GraduateSearchResult {
  userId: string;
  name: string;
  email: string;
  faculty?: string;
  cohortYear?: number;
}

export interface GraduateOutcome {
  id: string;
  cohortRef: string;
  studentName?: string;
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
  totalApplications: number;
  sectorBreakdown: Record<string, number>;
  alumniCount: number;
  coachingSessionCount: number;
}

export interface InstitutionSnapshot {
  id: string;
  year: number;
  employmentRate: number;
  medianSalary: number;
  timeToOfferDays: number;
  employedCount: number;
  furtherStudyCount: number;
  seekingCount: number;
  otherCount: number;
}

export interface ProgrammeSnapshot {
  id: string;
  programmeId: string;
  year: number;
  employmentRate: number;
  medianSalary: number;
}

export interface InstitutionInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface AlumniCareerStage {
  id: string;
  yearsRange: string;
  sector: string;
  count: number;
}

export interface AlumniSalaryStage {
  id: string;
  yearsRange: string;
  medianSalary: number;
  q1Salary: number;
  q3Salary: number;
}

export interface AlumniEngagement {
  id: string;
  month: string;
  mentorshipConnections: number;
  eventsAttended: number;
  jobPostings: number;
}

export interface CoachingWeekMetric {
  week: string;
  sessions: number;
  satisfaction: number;
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

export interface SectorTrend {
  quarter: string;
  finance?: number;
  tech?: number;
  healthcare?: number;
  education?: number;
  professional?: number;
}

export interface DistrictSalaryBenchmark {
  id: string;
  district: string;
  median: number;
  q1Salary: number;
  q3Salary: number;
  jobCount: number;
  year: number;
}

export interface SkillShortage {
  id: string;
  skill: string;
  shortage: number;
  demandGrowth: number;
  salaryPremium: number;
  supply: number;
}

export interface CompetencyFeedback {
  id: string;
  competency: string;
  current: number;
  desired: number;
  gap: number;
}

export interface DemandForecast {
  id: string;
  month: string;
  actual: number | null;
  forecast: number;
  historical: number;
}

export interface TopEmployer {
  rank: number;
  employer: string;
  sector: string;
  hires: number;
  avgSalary: number;
  satisfaction: number;
}

export interface PartnershipPipeline {
  id: string;
  stage: string;
  count: number;
  conversionRate: number;
  sortOrder: number;
}

export interface EmployerSatisfactionTrend {
  id: string;
  quarter: string;
  overall: number;
  graduates: number;
  support: number;
  processes: number;
}

export interface EmployerEvent {
  id: string;
  month: string;
  careerFairs: number;
  workshops: number;
  networking: number;
  attendance: number;
}

export interface PartnershipActivity {
  id: string;
  type: string;
  employer: string;
  action: string;
  createdAt: string;
}

export interface SectorCount {
  sector: string;
  count: number;
}

export interface TalentHubMetric {
  metric: string;
  value: number;
}
