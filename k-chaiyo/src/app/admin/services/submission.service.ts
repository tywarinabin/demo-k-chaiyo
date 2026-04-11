import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormSubmission, SubmissionFilters, PaginatedResponse, ApiResponse } from '../models/admin.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly API_URL = '/api/v1/admin/submissions';

  getSubmissions(filters?: SubmissionFilters): Observable<PaginatedResponse<FormSubmission>> {
    const params = this.buildQueryParams(filters);

    return this.http.get<PaginatedResponse<FormSubmission>>(this.API_URL, {
      headers: this.authService.getAuthHeaders(),
      params
    });
  }

  getSubmissionById(id: string): Observable<ApiResponse<FormSubmission>> {
    return this.http.get<ApiResponse<FormSubmission>>(`${this.API_URL}/${id}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateSubmissionStatus(
    id: string,
    status: 'pending' | 'reviewed' | 'contacted' | 'spam',
    notes?: string
  ): Observable<ApiResponse<FormSubmission>> {
    return this.http.patch<ApiResponse<FormSubmission>>(
      `${this.API_URL}/${id}`,
      { status, notes },
      { headers: this.authService.getAuthHeaders() }
    );
  }

  exportSubmissions(filters?: SubmissionFilters): Observable<Blob> {
    const params = this.buildQueryParams(filters);

    return this.http.get(`${this.API_URL}/export`, {
      headers: this.authService.getAuthHeaders(),
      params,
      responseType: 'blob'
    });
  }

  getSubmissionStats(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/stats`, {
      headers: this.authService.getAuthHeaders()
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
