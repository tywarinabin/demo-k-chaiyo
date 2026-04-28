import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  QueryList,
  ViewChildren,
  effect,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

type Step = 'phone' | 'otp';

@Component({
  selector: 'app-shop-auth-modal',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (auth.isModalOpen()) {
      <div
        class="fixed inset-0 z-[70] flex items-end sm:items-center justify-center font-poppins"
        role="dialog"
        aria-modal="true"
        aria-label="Login"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-fade-in"
          (click)="close()"
          aria-hidden="true"
        ></div>

        <div
          class="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-in"
        >
          <!-- Gradient header strip -->
          <div
            class="relative px-6 pt-7 pb-12 text-white"
            style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
          >
            <button
              type="button"
              (click)="close()"
              class="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition"
              aria-label="Close"
            >
              <i class="fas fa-xmark text-sm"></i>
            </button>
            <div class="flex items-center gap-3">
              <span
                class="h-11 w-11 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center"
              >
                <i class="fas fa-user-astronaut text-lg"></i>
              </span>
              <div class="leading-tight">
                <div class="text-[11px] uppercase tracking-[0.22em] opacity-85">
                  K Chaiyo?
                </div>
                <div class="text-lg font-bold">
                  {{ step() === 'phone' ? 'Log in to continue' : 'Verify your number' }}
                </div>
              </div>
            </div>
          </div>

          <div class="px-6 pt-6 pb-6 -mt-6 bg-white rounded-t-3xl">
            @if (step() === 'phone') {
              <p class="text-sm text-shop-mutedText mb-5">
                Enter your phone number — hami ek pal ma OTP pathauchhau.
              </p>

              <label class="block">
                <span class="sr-only">Phone number</span>
                <div
                  class="flex items-center gap-2 rounded-xl border border-gray-200 bg-shop-bg focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/25 focus-within:bg-white transition px-3 py-3"
                >
                  <span class="flex items-center gap-1.5 text-sm font-semibold text-shop-text pr-3 border-r border-gray-300">
                    <span class="text-base">🇳🇵</span> +977
                  </span>
                  <input
                    #phoneInput
                    type="tel"
                    inputmode="numeric"
                    maxlength="10"
                    placeholder="98XXXXXXXX"
                    [ngModel]="phone()"
                    (ngModelChange)="onPhoneChange($event)"
                    class="flex-1 bg-transparent text-[15px] tracking-wider text-shop-text placeholder:text-shop-mutedText outline-none"
                    autocomplete="tel"
                  />
                </div>
              </label>
              @if (phoneError()) {
                <p class="mt-2 text-xs text-red-500 font-medium animate-fade-in">
                  <i class="fas fa-circle-exclamation mr-1"></i>{{ phoneError() }}
                </p>
              }

              <button
                type="button"
                [disabled]="!isPhoneValid() || busy()"
                (click)="submitPhone()"
                class="mt-5 w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-white text-sm font-bold shadow-[0_8px_20px_rgba(124,58,237,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_24px_rgba(124,58,237,0.45)]"
                style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
              >
                @if (busy()) {
                  <i class="fas fa-circle-notch fa-spin"></i>
                  Sending OTP…
                } @else {
                  Send OTP
                  <i class="fas fa-arrow-right"></i>
                }
              </button>

              <p class="mt-4 text-center text-[11px] text-shop-mutedText leading-relaxed">
                By continuing you agree to K Chaiyo?'s
                <a class="text-brand-primary font-semibold">Terms</a> &
                <a class="text-brand-primary font-semibold">Privacy Policy</a>.
              </p>
            } @else {
              <div class="flex items-center justify-between mb-4">
                <div class="text-sm text-shop-mutedText">
                  OTP sent to
                  <span class="text-shop-text font-semibold">+977 {{ phone() }}</span>
                </div>
                <button
                  type="button"
                  (click)="editPhone()"
                  class="text-xs font-semibold text-brand-primary hover:underline"
                >
                  Edit
                </button>
              </div>

              <div
                class="flex items-center justify-between gap-2"
                role="group"
                aria-label="Enter six-digit OTP"
              >
                @for (i of [0,1,2,3,4,5]; track i) {
                  <input
                    #otpBox
                    type="text"
                    inputmode="numeric"
                    maxlength="1"
                    [value]="otpDigits()[i] || ''"
                    (input)="onOtpInput($event, i)"
                    (keydown)="onOtpKey($event, i)"
                    (paste)="onOtpPaste($event)"
                    class="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-bold text-shop-text bg-shop-bg border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25 focus:bg-white outline-none transition"
                    [class.border-red-300]="otpError()"
                    [attr.aria-label]="'Digit ' + (i + 1)"
                  />
                }
              </div>

              <div
                class="mt-2 text-[11px] text-shop-mutedText bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg px-3 py-2"
              >
                <i class="fas fa-circle-info mr-1 text-brand-primary"></i>
                Demo mode — use OTP
                <span class="font-bold tracking-widest text-shop-text">{{ auth.sampleOtp }}</span>
              </div>

              @if (otpError()) {
                <p class="mt-2 text-xs text-red-500 font-medium animate-fade-in">
                  <i class="fas fa-circle-exclamation mr-1"></i>{{ otpError() }}
                </p>
              }

              <button
                type="button"
                [disabled]="!isOtpComplete() || busy()"
                (click)="submitOtp()"
                class="mt-5 w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-white text-sm font-bold shadow-[0_8px_20px_rgba(124,58,237,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_24px_rgba(124,58,237,0.45)]"
                style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
              >
                @if (busy()) {
                  <i class="fas fa-circle-notch fa-spin"></i>
                  Verifying…
                } @else {
                  Verify & Continue
                  <i class="fas fa-check"></i>
                }
              </button>

              <div class="mt-4 text-center text-xs text-shop-mutedText">
                Didn't get it?
                @if (resendIn() > 0) {
                  <span>Resend in {{ resendIn() }}s</span>
                } @else {
                  <button
                    type="button"
                    (click)="resend()"
                    class="text-brand-primary font-semibold hover:underline"
                  >
                    Resend OTP
                  </button>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      @keyframes slide-up {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      .animate-slide-up {
        animation: slide-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
      .h-13 {
        height: 3.25rem;
      }
    `
  ]
})
export class ShopAuthModalComponent implements AfterViewInit {
  protected readonly auth = inject(AuthService);

  @ViewChildren('otpBox') private otpBoxes?: QueryList<ElementRef<HTMLInputElement>>;

  protected readonly step = signal<Step>('phone');
  protected readonly phone = signal('');
  protected readonly phoneError = signal<string | null>(null);
  protected readonly otpDigits = signal<string[]>(['', '', '', '', '', '']);
  protected readonly otpError = signal<string | null>(null);
  protected readonly busy = signal(false);
  protected readonly resendIn = signal(0);
  private resendTimer?: ReturnType<typeof setInterval>;

  constructor() {
    // Reset state each time modal opens
    effect(() => {
      if (this.auth.isModalOpen()) {
        this.step.set('phone');
        this.phone.set('');
        this.phoneError.set(null);
        this.otpDigits.set(['', '', '', '', '', '']);
        this.otpError.set(null);
        this.busy.set(false);
      } else {
        this.stopResendTimer();
      }
    });
  }

  ngAfterViewInit(): void {
    // no-op; focus handled contextually when step changes
  }

  protected isPhoneValid = () => /^[0-9]{10}$/.test(this.phone());

  protected isOtpComplete(): boolean {
    return this.otpDigits().every(d => d.length === 1);
  }

  @HostListener('document:keydown.escape')
  protected close(): void {
    this.auth.closeModal();
  }

  protected onPhoneChange(v: string): void {
    this.phone.set(v.replace(/\D/g, '').slice(0, 10));
    if (this.phoneError()) this.phoneError.set(null);
  }

  protected async submitPhone(): Promise<void> {
    if (!this.isPhoneValid()) {
      this.phoneError.set('Enter a valid 10-digit Nepali mobile number.');
      return;
    }
    this.busy.set(true);
    await this.auth.sendOtp(this.phone());
    this.busy.set(false);
    this.step.set('otp');
    this.startResendTimer();
    queueMicrotask(() => this.otpBoxes?.first?.nativeElement.focus());
  }

  protected editPhone(): void {
    this.step.set('phone');
    this.otpDigits.set(['', '', '', '', '', '']);
    this.otpError.set(null);
    this.stopResendTimer();
  }

  protected onOtpInput(e: Event, index: number): void {
    const input = e.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    const next = [...this.otpDigits()];
    next[index] = digit;
    this.otpDigits.set(next);
    input.value = digit;
    if (this.otpError()) this.otpError.set(null);
    if (digit && index < 5) {
      this.otpBoxes?.get(index + 1)?.nativeElement.focus();
    }
  }

  protected onOtpKey(e: KeyboardEvent, index: number): void {
    if (e.key === 'Backspace' && !this.otpDigits()[index] && index > 0) {
      this.otpBoxes?.get(index - 1)?.nativeElement.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      this.otpBoxes?.get(index - 1)?.nativeElement.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      this.otpBoxes?.get(index + 1)?.nativeElement.focus();
    } else if (e.key === 'Enter') {
      this.submitOtp();
    }
  }

  protected onOtpPaste(e: ClipboardEvent): void {
    const text = e.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) ?? '';
    if (!text) return;
    e.preventDefault();
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    this.otpDigits.set(next);
    const targetIndex = Math.min(text.length, 5);
    queueMicrotask(() => this.otpBoxes?.get(targetIndex)?.nativeElement.focus());
  }

  protected async submitOtp(): Promise<void> {
    const code = this.otpDigits().join('');
    if (code.length !== 6) return;
    this.busy.set(true);
    const ok = await this.auth.verifyOtp(code);
    this.busy.set(false);
    if (ok) {
      this.auth.closeModal();
    } else {
      this.otpError.set('OTP mildaina. Pheri try garnus.');
      this.otpDigits.set(['', '', '', '', '', '']);
      queueMicrotask(() => this.otpBoxes?.first?.nativeElement.focus());
    }
  }

  protected async resend(): Promise<void> {
    await this.auth.sendOtp(this.phone());
    this.startResendTimer();
  }

  private startResendTimer(): void {
    this.stopResendTimer();
    this.resendIn.set(30);
    this.resendTimer = setInterval(() => {
      const next = this.resendIn() - 1;
      if (next <= 0) {
        this.stopResendTimer();
      } else {
        this.resendIn.set(next);
      }
    }, 1000);
  }

  private stopResendTimer(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = undefined;
      this.resendIn.set(0);
    }
  }
}
