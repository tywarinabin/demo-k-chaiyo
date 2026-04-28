import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-shop-order-success',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (order.isSuccessOpen() && order.lastOrder(); as placed) {
      <div
        class="fixed inset-0 z-[80] flex items-center justify-center font-poppins"
        role="dialog"
        aria-modal="true"
        aria-label="Order placed"
      >
        <div
          class="absolute inset-0 bg-black/55 backdrop-blur-sm animate-fade-in"
          aria-hidden="true"
        ></div>

        <div
          class="relative w-full sm:max-w-md mx-3 bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in"
        >
          <!-- Gradient crown -->
          <div
            class="relative px-6 pt-8 pb-14 text-center text-white overflow-hidden"
            style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
          >
            <div class="confetti-dots" aria-hidden="true"></div>
            <div class="mx-auto flex items-center justify-center">
              <div
                class="relative h-24 w-24 rounded-full bg-white/15 border border-white/30 flex items-center justify-center animate-pulse-ring"
              >
                <svg
                  viewBox="0 0 52 52"
                  class="h-16 w-16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    class="tick-circle"
                    cx="26"
                    cy="26"
                    r="23"
                    fill="none"
                    stroke="white"
                    stroke-width="3"
                  />
                  <path
                    class="tick-check"
                    fill="none"
                    stroke="white"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14 27 L23 36 L39 18"
                  />
                </svg>
              </div>
            </div>
            <h2 class="mt-4 text-xl font-bold">Order Placed Successfully!</h2>
            <p class="mt-1 text-sm text-white/90">
              Dhanyabad — hami timro order ready gardaichau.
            </p>
          </div>

          <div class="px-6 pt-6 pb-6 -mt-8 bg-white rounded-t-3xl">
            <div class="rounded-2xl border border-gray-200 bg-shop-bg p-4 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase tracking-wider text-shop-mutedText">
                  Order ID
                </span>
                <span class="text-sm font-bold text-shop-text">#{{ placed.id }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase tracking-wider text-shop-mutedText">
                  Payment
                </span>
                <span class="text-sm font-bold text-shop-text">
                  Cash on Delivery
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs uppercase tracking-wider text-shop-mutedText">
                  Amount
                </span>
                <span class="text-sm font-bold text-shop-text">
                  ₹{{ placed.totalPaid }}
                </span>
              </div>
              <div class="flex items-center justify-between border-t border-gray-200 pt-3">
                <span class="text-xs uppercase tracking-wider text-shop-mutedText">
                  Arrives in
                </span>
                <span
                  class="inline-flex items-center gap-1.5 text-sm font-bold text-brand-primary"
                >
                  <i class="fas fa-bolt"></i>
                  {{ placed.etaMinutes }} minutes
                </span>
              </div>
            </div>

            <button
              type="button"
              (click)="close()"
              class="mt-5 w-full px-5 py-3.5 rounded-xl text-white text-sm font-bold shadow-[0_8px_20px_rgba(124,58,237,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(124,58,237,0.45)]"
              style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      @keyframes draw-circle {
        to { stroke-dashoffset: 0; }
      }
      @keyframes draw-check {
        to { stroke-dashoffset: 0; }
      }
      @keyframes pulse-ring {
        0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.45); }
        70%  { box-shadow: 0 0 0 24px rgba(255,255,255,0); }
        100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
      }
      .animate-pulse-ring {
        animation: pulse-ring 1.6s ease-out 0.35s 2;
      }
      .tick-circle {
        stroke-dasharray: 145;
        stroke-dashoffset: 145;
        animation: draw-circle 0.55s ease-out forwards;
      }
      .tick-check {
        stroke-dasharray: 48;
        stroke-dashoffset: 48;
        animation: draw-check 0.35s ease-out 0.55s forwards;
      }
      .confetti-dots {
        position: absolute;
        inset: 0;
        pointer-events: none;
        background-image:
          radial-gradient(rgba(255,255,255,0.25) 1.5px, transparent 2px),
          radial-gradient(rgba(255,255,255,0.15) 1px, transparent 2px);
        background-size: 22px 22px, 40px 40px;
        background-position: 0 0, 12px 12px;
        opacity: 0.55;
      }
    `
  ]
})
export class ShopOrderSuccessComponent {
  protected readonly order = inject(OrderService);
  private readonly cart = inject(CartService);

  protected close(): void {
    this.order.dismissSuccess();
    this.cart.clear();
    this.cart.closeDrawer();
  }
}
