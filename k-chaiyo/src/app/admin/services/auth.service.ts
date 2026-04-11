import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { AdminUser, LoginRequest, LoginResponse } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = '/api/v1/admin'; // Update with your backend URL

  private currentUserSubject = new BehaviorSubject<AdminUser | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check token validity on initialization
    if (this.hasValidToken()) {
      this.validateToken();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.setSession(response);
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_refresh_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('token_expiry');

    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    this.router.navigate(['/admin/login']);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = localStorage.getItem('admin_refresh_token');

    if (!refreshToken) {
      this.logout();
      return of({} as LoginResponse);
    }

    return this.http.post<LoginResponse>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
      tap(response => {
        if (response.success && response.token) {
          this.setSession(response);
        }
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        this.logout();
        throw error;
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getCurrentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  private setSession(response: LoginResponse): void {
    const expiryTime = Date.now() + (2 * 60 * 60 * 1000); // 2 hours

    localStorage.setItem('admin_token', response.token);
    localStorage.setItem('admin_refresh_token', response.refreshToken);
    localStorage.setItem('admin_user', JSON.stringify(response.user));
    localStorage.setItem('token_expiry', expiryTime.toString());

    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  private hasValidToken(): boolean {
    const token = localStorage.getItem('admin_token');
    const expiry = localStorage.getItem('token_expiry');

    if (!token || !expiry) {
      return false;
    }

    const now = Date.now();
    const expiryTime = parseInt(expiry, 10);

    // Check if token is expired or about to expire (within 5 minutes)
    if (now >= expiryTime - (5 * 60 * 1000)) {
      // Attempt to refresh token
      this.refreshToken().subscribe();
      return true;
    }

    return now < expiryTime;
  }

  private getUserFromStorage(): AdminUser | null {
    const userStr = localStorage.getItem('admin_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  private validateToken(): void {
    // Validate token with backend
    this.http.get<{ success: boolean; user: AdminUser }>(`${this.API_URL}/validate`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(() => {
        this.logout();
        return of({ success: false, user: null as any });
      })
    ).subscribe(response => {
      if (!response.success) {
        this.logout();
      }
    });
  }
}
