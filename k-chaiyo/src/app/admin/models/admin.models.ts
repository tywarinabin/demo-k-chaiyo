export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'viewer' | 'admin' | 'super_admin';
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: AdminUser;
}

export interface Visitor {
  id: string;
  ipHash: string;
  userAgent: string;
  visitedAt: Date;
  source: string;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  landingPage: string;
  countryCode?: string;
  sessionId: string;
  isBot: boolean;
}

export interface FormSubmission {
  id: string;
  visitorId: string;
  ipHash: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  message?: string;
  needsCategory?: string;
  consentGiven: boolean;
  submittedAt: Date;
  status: 'pending' | 'reviewed' | 'contacted' | 'spam';
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
  visitor?: Visitor;
}

export interface DashboardAnalytics {
  totalVisits: number;
  uniqueVisitors: number;
  formSubmissions: number;
  conversionRate: number;
  topSources: SourceAnalytics[];
  topCountries: CountryAnalytics[];
  hourlyTrend: TrendData[];
  dailyTrend: TrendData[];
  recentSubmissions: FormSubmission[];
}

export interface SourceAnalytics {
  source: string;
  visits: number;
  conversions: number;
  conversionRate: number;
}

export interface CountryAnalytics {
  country: string;
  countryCode: string;
  visits: number;
}

export interface TrendData {
  timestamp: Date;
  visits: number;
  submissions: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface VisitorFilters {
  startDate?: Date;
  endDate?: Date;
  source?: string;
  countryCode?: string;
  isBot?: boolean;
  page?: number;
  limit?: number;
}

export interface SubmissionFilters {
  status?: 'pending' | 'reviewed' | 'contacted' | 'spam';
  startDate?: Date;
  endDate?: Date;
  needsCategory?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
