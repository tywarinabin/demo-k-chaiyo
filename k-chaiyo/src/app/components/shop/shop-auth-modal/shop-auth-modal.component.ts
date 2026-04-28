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
        class="fixed inset-0 z-[70] flex items-center justify-center px-4 py-6 sm:p-0 font-poppins"
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
          class="relative w-full sm:max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-in"
        >
          <!-- Gradient header strip -->
          <div
            class="relative px-8 pt-10 pb-9 text-white"
            style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
          >
            <button
              type="button"
              (click)="close()"
              class="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition"
              aria-label="Close"
            >
              <span class="text-xl">×</span>
            </button>
            <div class="text-center">
              <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 border border-white/25 text-2xl">
                👤
              </div>
              <p class="text-xs uppercase tracking-[0.24em] text-white/80 mb-2">K Chaiyo?</p>
              <h2 class="text-2xl sm:text-3xl font-semibold leading-tight">
                {{ step() === 'phone' ? 'Login to continue' : 'Verify your phone' }}
              </h2>
            </div>
          </div>

          <div class="px-8 pt-8 pb-8 bg-white">
            @if (step() === 'phone') {
              <p class="text-sm text-shop-mutedText mb-5">
                Enter your phone number — hami ek pal ma OTP pathauchhau.
              </p>

              <label class="block">
                <span class="sr-only">Phone number</span>
                <div
                  class="flex items-center gap-3 rounded-3xl border border-gray-200 bg-shop-bg focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:bg-white transition px-4 py-4"
                >
                  <span class="flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2 text-sm font-semibold text-shop-text border border-gray-200">
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
                    class="flex-1 bg-transparent text-base tracking-wide text-shop-text placeholder:text-shop-mutedText outline-none"
                    autocomplete="tel"
                  />
                </div>
              </label>
              @if (phoneError()) {
                <p class="mt-3 text-sm text-red-500 font-medium animate-fade-in">
                  {{ phoneError() }}
                </p>
              }

              <button
                type="button"
                [disabled]="!isPhoneValid() || busy()"
                (click)="submitPhone()"
                class="mt-6 w-full rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#2563EB] px-6 py-4 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(124,58,237,0.2)] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(124,58,237,0.25)]"
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
              @if (otpSuccess()) {
                <div class="py-16 text-center">
                  <span class="success-tick bg-emerald-900 text-emerald-100 shadow-[0_0_0_20px_rgba(5,150,105,0.18)]">
                    ✓
                  </span>
                  <div class="mt-6 text-3xl font-semibold text-emerald-950">Login successful</div>
                </div>
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
                      class="w-11 h-13 sm:w-12 sm:h-14 text-center text-lg font-extrabold text-shop-text bg-shop-bg border border-gray-200 rounded-xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/25 focus:bg-white outline-none transition"
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
      .success-tick {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 5.5rem;
        height: 5.5rem;
        border-radius: 9999px;
        font-size: 2.75rem;
        font-weight: 900;
        animation: pop-scale 0.45s ease-out both;
      }
      @keyframes pop-scale {
        0% {
          transform: scale(0.3);
          opacity: 0;
        }
        70% {
          transform: scale(1.05);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
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
  protected readonly otpSuccess = signal(false);
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
        this.otpSuccess.set(false);
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
    this.otpSuccess.set(false);
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
    if (this.otpSuccess()) this.otpSuccess.set(false);
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
    if (this.otpSuccess()) this.otpSuccess.set(false);
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
      this.otpSuccess.set(true);
      queueMicrotask(() => {
        setTimeout(() => this.close(), 900);
      });
    } else {
      this.otpError.set('OTP mildaina. Pheri try garnus.');
      this.otpDigits.set(['', '', '', '', '', '']);
      this.otpSuccess.set(false);
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
