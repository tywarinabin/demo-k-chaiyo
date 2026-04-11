import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardAnalytics, ApiResponse } from '../models/admin.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly API_URL = '/api/v1/admin/analytics';

  getDashboardAnalytics(startDate?: Date, endDate?: Date, source?: string): Observable<ApiResponse<DashboardAnalytics>> {
    const params: any = {};

    if (startDate) {
      params.startDate = startDate.toISOString();
    }
    if (endDate) {
      params.endDate = endDate.toISOString();
    }
    if (source) {
      params.source = source;
    }

    return this.http.get<ApiResponse<DashboardAnalytics>>(`${this.API_URL}/dashboard`, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  getSourceBreakdown(startDate?: Date, endDate?: Date): Observable<ApiResponse<any>> {
    const params: any = {};

    if (startDate) {
      params.startDate = startDate.toISOString();
    }
    if (endDate) {
      params.endDate = endDate.toISOString();
    }

    return this.http.get<ApiResponse<any>>(`${this.API_URL}/sources`, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  getCountryBreakdown(startDate?: Date, endDate?: Date): Observable<ApiResponse<any>> {
    const params: any = {};

    if (startDate) {
      params.startDate = startDate.toISOString();
    }
    if (endDate) {
      params.endDate = endDate.toISOString();
    }

    return this.http.get<ApiResponse<any>>(`${this.API_URL}/countries`, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  getTrendData(period: 'hourly' | 'daily' | 'weekly', startDate?: Date, endDate?: Date): Observable<ApiResponse<any>> {
    const params: any = { period };

    if (startDate) {
      params.startDate = startDate.toISOString();
    }
    if (endDate) {
      params.endDate = endDate.toISOString();
    }

    return this.http.get<ApiResponse<any>>(`${this.API_URL}/trends`, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }
}
