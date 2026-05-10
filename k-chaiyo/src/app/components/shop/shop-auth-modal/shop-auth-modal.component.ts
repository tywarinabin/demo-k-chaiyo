import {
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

type Step = 'phone' | 'otp' | 'success';

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
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fade-in"
          (click)="close()"
          aria-hidden="true"
        ></div>

        <!-- ── Modal card ── -->
        <div class="modal-card relative w-full sm:max-w-[420px] bg-white sm:rounded-2xl rounded-t-3xl shadow-[0_32px_80px_rgba(0,0,0,0.22)] overflow-hidden">

          <!-- Mobile drag pill -->
          <div class="sm:hidden flex justify-center pt-3 pb-0">
            <div class="w-9 h-1 rounded-full bg-gray-200"></div>
          </div>

          <!-- ═══ SUCCESS STATE — full card takeover ═══ -->
          @if (step() === 'success') {
            <div class="flex flex-col items-center justify-center px-8 py-10 animate-success-in">

              <!-- Animated SVG tick -->
              <div class="relative mb-6">
                <div class="success-glow"></div>
                <svg viewBox="0 0 88 88" class="w-28 h-28 relative z-10" fill="none" aria-hidden="true">
                  <circle cx="44" cy="44" r="40" fill="rgba(124,58,237,0.07)"/>
                  <circle
                    cx="44" cy="44" r="35"
                    stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round"
                    stroke-dasharray="220" stroke-dashoffset="220"
                    class="draw-circle"
                    transform="rotate(-90 44 44)"
                  />
                  <path
                    d="M27 45 L38 56 L62 30"
                    stroke="#2563EB" stroke-width="4"
                    stroke-linecap="round" stroke-linejoin="round"
                    stroke-dasharray="58" stroke-dashoffset="58"
                    class="draw-check"
                  />
                </svg>
              </div>

              <h2 class="text-2xl font-bold text-shop-text mb-1.5">Verified!</h2>
              <p class="text-sm text-shop-mutedText text-center leading-relaxed mb-2">
                Welcome to K Chaiyo? 🎉
              </p>
              <p class="text-[12px] text-shop-mutedText">Logging you in…</p>

              <!-- 3-second progress bar -->
              <div class="mt-8 w-full h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  class="h-full rounded-full progress-bar-3s"
                  style="background: linear-gradient(90deg, #7C3AED 0%, #2563EB 100%);"
                ></div>
              </div>
            </div>
          }

          <!-- ═══ PHONE / OTP STATES ═══ -->
          @else {
            <!-- Close button -->
            <button
              type="button"
              (click)="close()"
              class="absolute top-5 right-5 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-shop-mutedText hover:text-shop-text transition-all duration-200"
              aria-label="Close"
            >
              <i class="fas fa-xmark text-sm"></i>
            </button>

            <!-- Brand identity -->
            <div class="flex flex-col items-center pt-7 pb-5 px-6">
              <div class="flex items-center gap-2.5 mb-4">
                <span
                  class="inline-flex h-10 w-10 items-center justify-center rounded-xl shadow-[0_6px_20px_rgba(124,58,237,0.36)]"
                  style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
                >
                  <svg viewBox="0 0 32 32" class="h-5 w-5 text-white" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 13h16v7a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5v-7Z"/>
                    <path d="M22 15h2a3 3 0 0 1 0 6h-2"/>
                    <path d="M11 5c.8 1.2.8 2.5 0 3.7s-.8 2.5 0 3.7"/>
                    <path d="M16 5c.8 1.2.8 2.5 0 3.7s-.8 2.5 0 3.7"/>
                  </svg>
                </span>
                <span
                  class="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent"
                >K Chaiyo?</span>
              </div>

              <!-- Step progress indicator -->
              <div class="flex items-center gap-0 mb-2">
                <!-- Step 1 -->
                <div class="step-dot" [class.step-active]="step() === 'phone'" [class.step-done]="step() === 'otp'">
                  @if (step() === 'otp') {
                    <i class="fas fa-check" style="font-size:8px;"></i>
                  } @else { 1 }
                </div>
                <div class="step-line" [class.step-line-done]="step() === 'otp'"></div>
                <!-- Step 2 -->
                <div class="step-dot" [class.step-active]="step() === 'otp'" [class.step-pending]="step() === 'phone'">
                  2
                </div>
              </div>
              <p class="text-[11px] text-shop-mutedText">
                @if (step() === 'phone') { Step 1 of 2 · Enter phone number }
                @else { Step 2 of 2 · Enter OTP }
              </p>
            </div>

            <!-- Divider -->
            <div
              class="h-px mx-0"
              style="background: linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.2) 30%, rgba(37,99,235,0.2) 70%, transparent 100%);"
            ></div>

            <!-- Form area -->
            <div class="px-6 py-6">

              <!-- ── PHONE STEP ── -->
              @if (step() === 'phone') {
                <div class="animate-step-in">
                  <h3 class="text-base font-bold text-shop-text mb-1">Log in to continue</h3>
                  <p class="text-[13px] text-shop-mutedText mb-5">
                    We'll send a one-time password to your number.
                  </p>

                  <label class="block">
                    <span class="sr-only">Phone number</span>
                    <div
                      class="flex items-center rounded-xl border border-gray-200 bg-gray-50 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/20 focus-within:bg-white transition-all duration-250 overflow-hidden"
                    >
                      <span class="flex items-center gap-1.5 px-3 py-3.5 text-sm font-semibold text-shop-text border-r border-gray-200 shrink-0 bg-white">
                        <span class="text-base leading-none">🇳🇵</span>
                        <span class="text-shop-mutedText">+977</span>
                      </span>
                      <input
                        #phoneInput
                        type="tel"
                        inputmode="numeric"
                        maxlength="10"
                        placeholder="98XXXXXXXX"
                        [ngModel]="phone()"
                        (ngModelChange)="onPhoneChange($event)"
                        class="flex-1 bg-transparent px-3 py-3.5 text-[15px] tracking-wider text-shop-text placeholder:text-gray-300 outline-none"
                        autocomplete="tel"
                      />
                    </div>
                  </label>

                  @if (phoneError()) {
                    <p class="mt-2 text-xs text-red-500 font-medium flex items-center gap-1.5 animate-fade-in">
                      <i class="fas fa-circle-exclamation"></i>{{ phoneError() }}
                    </p>
                  }

                  <button
                    type="button"
                    [disabled]="!isPhoneValid() || busy()"
                    (click)="submitPhone()"
                    class="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold shadow-[0_8px_20px_rgba(124,58,237,0.32)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_12px_28px_rgba(124,58,237,0.44)] active:translate-y-0"
                    style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
                  >
                    @if (busy()) {
                      <i class="fas fa-circle-notch fa-spin text-sm"></i>
                      Sending OTP…
                    } @else {
                      Send OTP
                      <i class="fas fa-arrow-right text-sm"></i>
                    }
                  </button>

                  <p class="mt-4 text-center text-[11px] text-shop-mutedText leading-relaxed">
                    By continuing you agree to K Chaiyo?'s
                    <a class="text-brand-primary font-semibold cursor-pointer hover:underline">Terms</a>
                    &amp;
                    <a class="text-brand-primary font-semibold cursor-pointer hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              }

              <!-- ── OTP STEP ── -->
              @else {
                <div class="animate-step-in">
                  <div class="flex items-center justify-between mb-1">
                    <h3 class="text-base font-bold text-shop-text">Verify your number</h3>
                    <button
                      type="button"
                      (click)="editPhone()"
                      class="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
                    >
                      <i class="fas fa-pen text-[9px]"></i> Edit
                    </button>
                  </div>
                  <p class="text-[13px] text-shop-mutedText mb-5">
                    OTP sent to <span class="font-semibold text-shop-text">+977 {{ phone() }}</span>
                  </p>

                  <!-- OTP boxes -->
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
                        class="otp-box"
                        [class.otp-box--error]="otpError()"
                        [attr.aria-label]="'Digit ' + (i + 1)"
                      />
                    }
                  </div>

                  <!-- Demo hint -->
                  <div class="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 border border-indigo-100">
                    <i class="fas fa-circle-info text-brand-primary text-[11px] shrink-0"></i>
                    <span class="text-[11px] text-shop-mutedText">
                      Demo — use OTP
                      <span class="font-bold tracking-[0.2em] text-shop-text ml-1">{{ auth.sampleOtp }}</span>
                    </span>
                  </div>

                  @if (otpError()) {
                    <p class="mt-2 text-xs text-red-500 font-medium flex items-center gap-1.5 animate-fade-in">
                      <i class="fas fa-circle-exclamation"></i>{{ otpError() }}
                    </p>
                  }

                  <button
                    type="button"
                    [disabled]="!isOtpComplete() || busy()"
                    (click)="submitOtp()"
                    class="mt-5 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white text-sm font-bold shadow-[0_8px_20px_rgba(124,58,237,0.32)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_12px_28px_rgba(124,58,237,0.44)] active:translate-y-0"
                    style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
                  >
                    @if (busy()) {
                      <i class="fas fa-circle-notch fa-spin text-sm"></i>
                      Verifying…
                    } @else {
                      Verify & Continue
                      <i class="fas fa-shield-halved text-sm"></i>
                    }
                  </button>

                  <div class="mt-4 text-center text-xs text-shop-mutedText">
                    Didn't receive it?
                    @if (resendIn() > 0) {
                      <span class="font-medium"> Resend in <span class="text-shop-text">{{ resendIn() }}s</span></span>
                    } @else {
                      <button
                        type="button"
                        (click)="resend()"
                        class="ml-1 font-semibold text-brand-primary hover:underline"
                      >Resend OTP</button>
                    }
                  </div>
                </div>
              }

            </div>
          }

        </div>
      </div>
    }
  `,
  styles: [`
    /* ── Modal card entrance ── */
    @keyframes modal-slide-up {
      from { transform: translateY(40px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    .modal-card {
      animation: modal-slide-up 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    /* ── Step form entrance ── */
    @keyframes step-in {
      from { opacity: 0; transform: translateX(12px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .animate-step-in {
      animation: step-in 0.25s ease-out both;
    }

    /* ── Step progress dots & line ── */
    .step-dot {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      border: 2px solid #e5e7eb;
      color: #9ca3af;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .step-active {
      background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);
      border-color: transparent;
      color: white;
      box-shadow: 0 4px 14px rgba(124,58,237,0.38);
    }
    .step-done {
      background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);
      border-color: transparent;
      color: white;
    }
    .step-pending {
      border-color: #e5e7eb;
      color: #d1d5db;
    }
    .step-line {
      width: 40px;
      height: 2px;
      background: #e5e7eb;
      border-radius: 2px;
      transition: background 0.35s ease;
    }
    .step-line-done {
      background: linear-gradient(90deg, #7C3AED, #2563EB);
    }

    /* ── OTP input boxes ── */
    .otp-box {
      width: 44px;
      height: 52px;
      text-align: center;
      font-size: 18px;
      font-weight: 700;
      color: #1f2937;
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      outline: none;
      transition: all 0.2s ease;
      caret-color: #7C3AED;
    }
    .otp-box:focus {
      border-color: #7C3AED;
      background: white;
      box-shadow: 0 0 0 3px rgba(124,58,237,0.15);
      transform: scale(1.06);
    }
    .otp-box--error {
      border-color: #fca5a5;
      background: #fff5f5;
    }

    /* ── Success entrance ── */
    @keyframes success-in {
      from { opacity: 0; transform: scale(0.9) translateY(12px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-success-in {
      animation: success-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    /* ── SVG draw circle ── */
    @keyframes draw-circle {
      to { stroke-dashoffset: 0; }
    }
    .draw-circle {
      animation: draw-circle 0.7s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
    }

    /* ── SVG draw checkmark ── */
    @keyframes draw-check {
      to { stroke-dashoffset: 0; }
    }
    .draw-check {
      animation: draw-check 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.75s forwards;
    }

    /* ── Ambient success glow ── */
    .success-glow {
      position: absolute;
      inset: -12px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(124,58,237,0.16) 0%, transparent 70%);
      animation: glow-pulse 1.8s ease-in-out infinite;
    }
    @keyframes glow-pulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50%       { opacity: 1;   transform: scale(1.1); }
    }

    /* ── 3-second progress bar ── */
    @keyframes progress-3s {
      from { width: 0%; }
      to   { width: 100%; }
    }
    .progress-bar-3s {
      width: 0%;
      animation: progress-3s 3s linear forwards;
    }
  `]
})
export class ShopAuthModalComponent {
  protected readonly auth = inject(AuthService);

  @ViewChildren('otpBox') private readonly otpBoxes?: QueryList<ElementRef<HTMLInputElement>>;

  protected readonly step = signal<Step>('phone');
  protected readonly phone = signal('');
  protected readonly phoneError = signal<string | null>(null);
  protected readonly otpDigits = signal<string[]>(['', '', '', '', '', '']);
  protected readonly otpError = signal<string | null>(null);
  protected readonly busy = signal(false);
  protected readonly resendIn = signal(0);

  private resendTimer?: ReturnType<typeof setInterval>;
  private successTimer?: ReturnType<typeof setTimeout>;

  constructor() {
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
        this.cancelSuccessTimer();
      }
    });
  }

  protected isPhoneValid = () => /^[0-9]{10}$/.test(this.phone());

  protected isOtpComplete(): boolean {
    return this.otpDigits().every(d => d.length === 1);
  }

  @HostListener('document:keydown.escape')
  protected close(): void {
    this.cancelSuccessTimer();
    this.auth.closeModal();
  }

  protected onPhoneChange(v: string): void {
    this.phone.set(v.replaceAll(/\D/g, '').slice(0, 10));
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
    const digit = input.value.replaceAll(/\D/g, '').slice(-1);
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
    const text = e.clipboardData?.getData('text')?.replaceAll(/\D/g, '').slice(0, 6) ?? '';
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
      this.stopResendTimer();
      this.step.set('success');
      this.successTimer = setTimeout(() => this.auth.closeModal(), 3000);
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

  private cancelSuccessTimer(): void {
    if (this.successTimer) {
      clearTimeout(this.successTimer);
      this.successTimer = undefined;
    }
  }
}
