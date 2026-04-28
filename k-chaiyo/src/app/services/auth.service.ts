import { Injectable, computed, signal } from '@angular/core';

export interface AuthUser {
  phone: string;
  name: string;
}

/**
 * Demo auth. Sample OTP lives here so the UI can show a hint without
 * leaking it elsewhere. Replace with real OTP gateway when available.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** Demo-only; never log or echo this in production code. */
  readonly sampleOtp = '123456';

  private readonly _user = signal<AuthUser | null>(null);
  private readonly _modalOpen = signal(false);
  private pendingPhone: string | null = null;

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);
  readonly isModalOpen = this._modalOpen.asReadonly();

  openModal(): void {
    this._modalOpen.set(true);
  }

  closeModal(): void {
    this._modalOpen.set(false);
  }

  sendOtp(phone: string): Promise<void> {
    this.pendingPhone = phone;
    return new Promise(resolve => setTimeout(resolve, 700));
  }

  verifyOtp(code: string): Promise<boolean> {
    return new Promise(resolve =>
      setTimeout(() => {
        if (code === this.sampleOtp && this.pendingPhone) {
          this._user.set({
            phone: this.pendingPhone,
            name: 'Namaste, K-Shopper'
          });
          this.pendingPhone = null;
          resolve(true);
        } else {
          resolve(false);
        }
      }, 550)
    );
  }

  logout(): void {
    this._user.set(null);
  }
}
