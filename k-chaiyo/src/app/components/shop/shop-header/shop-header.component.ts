import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { interval } from 'rxjs';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-shop-header',
  standalone: true,
  imports: [RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header
      class="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 font-poppins animate-fade-in"
    >
      <div
        class="w-full px-3 sm:px-6 lg:px-10 xl:px-14 py-3 flex items-center gap-2 sm:gap-4 md:gap-6"
      >
        <!-- Brand: logo + wordmark -->
        <a
          routerLink="/"
          class="flex items-center gap-2.5 shrink-0 transition-transform hover:scale-[1.02]"
          aria-label="K Chaiyo home"
        >
          <span
            class="relative inline-flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl shadow-[0_6px_16px_rgba(124,58,237,0.35)]"
            style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 32 32"
              class="h-6 w-6 md:h-7 md:w-7 text-white drop-shadow"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 13h16v7a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5v-7Z" />
              <path d="M22 15h2a3 3 0 0 1 0 6h-2" />
              <path d="M11 5c.8 1.2.8 2.5 0 3.7s-.8 2.5 0 3.7" />
              <path d="M16 5c.8 1.2.8 2.5 0 3.7s-.8 2.5 0 3.7" />
            </svg>
            <span
              class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-white text-brand-primary text-[10px] font-black flex items-center justify-center shadow-sm"
            >
              ?
            </span>
          </span>

          <span class="flex flex-col leading-none">
            <span class="text-[11px] font-semibold tracking-[0.22em] uppercase text-shop-mutedText -mb-0.5 hidden sm:block">
              Nepal's
            </span>
            <span class="flex items-baseline gap-0.5">
              <span
                class="text-xl md:text-[1.55rem] font-extrabold tracking-tight bg-gradient-to-r from-brand-primary via-[#6D5AE8] to-brand-secondary bg-clip-text text-transparent"
              >
                K Chaiyo
              </span>
              <span class="text-xl md:text-[1.55rem] font-black text-brand-secondary">?</span>
            </span>
          </span>
        </a>

        <!-- Delivery block: lg+ -->
        <div class="hidden lg:flex flex-col shrink-0 leading-tight pl-4 border-l border-gray-200">
          <span class="text-[14px] font-bold text-shop-text flex items-center gap-1.5">
            <span
              class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary/15 to-brand-secondary/15 text-brand-primary text-[10px]"
            >
              <i class="fas fa-bolt"></i>
            </span>
            Delivery in 22 minutes
          </span>
          <button
            type="button"
            class="text-[11px] text-shop-mutedText flex items-center gap-1 mt-0.5 hover:text-brand-primary transition"
          >
            <i class="fas fa-location-dot text-[10px] text-brand-primary"></i>
            HATTIBAN, Mitrapur
            <i class="fas fa-chevron-down text-[9px]"></i>
          </button>
        </div>

        <!-- Search -->
        <div class="flex-1 min-w-0 max-w-[760px]">
          <label
            class="group relative flex items-center rounded-xl bg-shop-bg border border-gray-200 focus-within:border-brand-primary focus-within:ring-2 focus-within:ring-brand-primary/25 focus-within:bg-white transition-all duration-300"
          >
            <span class="sr-only">Search products</span>
            <i
              class="fas fa-magnifying-glass absolute left-3.5 text-shop-mutedText text-sm transition-all duration-300 group-focus-within:text-brand-primary group-focus-within:scale-110"
            ></i>
            <input
              type="search"
              [(ngModel)]="query"
              (focus)="focused.set(true)"
              (blur)="focused.set(false)"
              [placeholder]="placeholder()"
              class="w-full bg-transparent pl-10 pr-3 py-2.5 sm:py-3 text-[13px] sm:text-sm text-shop-text placeholder:text-shop-mutedText outline-none transition-all"
            />
            @if (query) {
              <button
                type="button"
                (click)="query = ''"
                class="mr-2 h-6 w-6 flex items-center justify-center rounded-full text-shop-mutedText hover:bg-gray-200 hover:text-shop-text transition"
                aria-label="Clear"
              >
                <i class="fas fa-xmark text-xs"></i>
              </button>
            }
            <span
              class="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-gradient-to-r from-brand-primary to-brand-secondary transition-transform duration-300 group-focus-within:scale-x-100"
              aria-hidden="true"
            ></span>
          </label>
        </div>

        <!-- Login / User chip: sm+ -->
        @if (!auth.isAuthenticated()) {
          <button
            type="button"
            (click)="auth.openModal()"
            class="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-shop-text hover:text-brand-primary transition"
          >
            <i class="fas fa-user text-xs"></i>
            Login
          </button>
        } @else {
          <div class="relative hidden sm:block" (mouseleave)="showMenu.set(false)">
            <button
              type="button"
              (click)="toggleMenu()"
              class="inline-flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-brand-primary/40 transition"
              [attr.aria-expanded]="showMenu()"
            >
              <span
                class="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
              >
                {{ userInitial() }}
              </span>
              <span class="text-xs font-semibold text-shop-text">
                +977 ••{{ userPhoneTail() }}
              </span>
              <i class="fas fa-chevron-down text-[10px] text-shop-mutedText"></i>
            </button>
            @if (showMenu()) {
              <div
                class="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-xl overflow-hidden animate-fade-in z-50"
                role="menu"
              >
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-xs text-shop-mutedText">Signed in as</p>
                  <p class="text-sm font-bold text-shop-text">
                    +977 {{ auth.user()?.phone }}
                  </p>
                </div>
                <button
                  type="button"
                  (click)="logout()"
                  class="w-full px-4 py-2.5 text-left text-sm font-semibold text-shop-text hover:bg-shop-bg transition flex items-center gap-2"
                >
                  <i class="fas fa-right-from-bracket text-shop-mutedText"></i>
                  Log out
                </button>
              </div>
            }
          </div>
        }

        <!-- Cart -->
        <button
          type="button"
          (click)="cart.openDrawer()"
          class="relative inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-white text-sm font-semibold shadow-[0_6px_18px_rgba(124,58,237,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(124,58,237,0.45)] active:translate-y-0"
          style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
          [attr.aria-label]="'Open cart with ' + cart.totalItems() + ' items'"
        >
          <i class="fas fa-bag-shopping text-[15px]"></i>
          @if (cart.totalItems() > 0) {
            <span class="hidden sm:flex flex-col items-start leading-tight">
              <span class="text-[10px] font-medium opacity-90">
                {{ cart.totalItems() }}
                {{ cart.totalItems() === 1 ? 'item' : 'items' }}
              </span>
              <span class="text-[12px] font-bold">₹{{ cart.itemsTotal() }}</span>
            </span>
            <span
              class="sm:hidden absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full bg-white text-brand-primary text-[10px] font-bold shadow"
            >
              {{ cart.totalItems() }}
            </span>
          } @else {
            <span class="hidden sm:inline text-[13px] font-semibold">My Cart</span>
          }
        </button>
      </div>

      <!-- Mobile delivery strip -->
      <div
        class="lg:hidden px-3 sm:px-6 pb-2.5 -mt-1 flex items-center gap-2 text-[11px] text-shop-mutedText"
      >
        <i class="fas fa-bolt text-brand-primary"></i>
        <span class="font-semibold text-shop-text">Delivery in 22 min</span>
        <span class="opacity-50">•</span>
        <i class="fas fa-location-dot text-brand-primary"></i>
        <span class="truncate">HATTIBAN, Mitrapur</span>
      </div>
    </header>
  `
})
export class ShopHeaderComponent implements OnInit {
  protected readonly cart = inject(CartService);
  protected readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  protected query = '';
  protected readonly focused = signal(false);
  protected readonly showMenu = signal(false);

  protected userInitial = (): string => {
    const phone = this.auth.user()?.phone ?? '';
    return phone ? phone.charAt(0) : 'K';
  };

  protected userPhoneTail = (): string => {
    const phone = this.auth.user()?.phone ?? '';
    return phone.slice(-4);
  };

  protected toggleMenu(): void {
    this.showMenu.update(v => !v);
  }

  protected logout(): void {
    this.auth.logout();
    this.showMenu.set(false);
  }

  private readonly prompts = [
    "Search 'doodh'",
    "Search 'chips'",
    "Search 'chiya'",
    "Search 'chocolate'",
    "Search 'maggi'",
    "Search 'coffee'"
  ];
  private readonly promptIndex = signal(0);

  protected placeholder = (): string =>
    this.query || this.focused() ? 'Search products…' : this.prompts[this.promptIndex()];

  ngOnInit(): void {
    interval(2200)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (!this.focused() && !this.query) {
          this.promptIndex.update(i => (i + 1) % this.prompts.length);
        }
      });
  }
}
