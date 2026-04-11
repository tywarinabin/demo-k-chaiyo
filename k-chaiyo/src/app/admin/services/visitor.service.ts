import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Visitor, VisitorFilters, PaginatedResponse, ApiResponse } from '../models/admin.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly API_URL = '/api/v1/admin/visitors';

  getVisitors(filters?: VisitorFilters): Observable<PaginatedResponse<Visitor>> {
    const params = this.buildQueryParams(filters);

    return this.http.get<PaginatedResponse<Visitor>>(this.API_URL, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  getVisitorById(id: string): Observable<ApiResponse<Visitor>> {
    return this.http.get<ApiResponse<Visitor>>(`${this.API_URL}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getVisitorStats(filters?: { startDate?: Date; endDate?: Date }): Observable<ApiResponse<any>> {
    const params = this.buildQueryParams(filters);

    return this.http.get<ApiResponse<any>>(`${this.API_URL}/stats`, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  exportVisitors(filters?: VisitorFilters): Observable<Blob> {
    const params = this.buildQueryParams(filters);

    return this.http.get(`${this.API_URL}/export`, {
      headers: this.authService.getAuthHeaders(),
      params,
      responseType: 'blob'
    });
  }

  private buildQueryParams(filters?: any): any {
    if (!filters) {
      return {};
    }

    const params: any = {};

    Object.keys(filters).forEach(key => {
      const value = filters[key];

      if (value !== undefined && value !== null) {
        if (value instanceof Date) {
          params[key] = value.toISOString();
        } else {
          params[key] = value.toString();
        }
      }
    });

    return params;
  }
}
