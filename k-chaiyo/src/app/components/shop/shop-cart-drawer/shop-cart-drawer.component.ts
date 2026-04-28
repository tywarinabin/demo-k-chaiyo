import { ChangeDetectionStrategy, Component, HostListener, effect, inject, signal } from '@angular/core';
import { CustomImageComponent } from '../../../shared/custom-image/custom-image.component';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../services/auth.service';
import { OrderService, PaymentMethod } from '../../../services/order.service';

type DrawerView = 'cart' | 'checkout';

@Component({
  selector: 'app-shop-cart-drawer',
  standalone: true,
  imports: [CustomImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cart.isOpen()) {
      <div
        class="fixed inset-0 z-[60] flex justify-end font-poppins"
        role="dialog"
        aria-modal="true"
        aria-label="My Cart"
      >
        <div
          class="absolute inset-0 bg-black/45 backdrop-blur-[2px] animate-fade-in"
          (click)="close()"
          aria-hidden="true"
        ></div>

        <section
          class="relative flex flex-col h-full w-full max-w-[440px] bg-[#F5F5F7] shadow-2xl animate-slide-in-right"
        >
          <!-- Header -->
          <header
            class="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200"
          >
            <button
              type="button"
              (click)="headerBack()"
              class="flex items-center gap-3 text-shop-text group"
              [attr.aria-label]="view() === 'cart' ? 'Close cart' : 'Back to cart'"
            >
              <span
                class="h-9 w-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
              >
                <i class="fas fa-arrow-left text-base"></i>
              </span>
              <span class="text-[17px] font-bold">
                {{ view() === 'cart' ? 'My Cart' : 'Checkout' }}
              </span>
            </button>

            @if (view() === 'cart') {
              <button
                type="button"
                class="flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r from-brand-primary to-brand-secondary bg-clip-text text-transparent hover:opacity-80 transition"
              >
                <i class="fas fa-share-nodes text-brand-primary"></i>
                <span>Share</span>
              </button>
            } @else {
              <span
                class="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full"
              >
                <i class="fas fa-lock"></i>
                Secure
              </span>
            }
          </header>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            @if (cart.cartItems().length === 0) {
              <div class="flex flex-col items-center justify-center py-24 text-center text-shop-mutedText animate-fade-in">
                <div
                  class="h-20 w-20 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-brand-primary/15 to-brand-secondary/15"
                >
                  <i class="fas fa-cart-shopping text-3xl text-brand-primary"></i>
                </div>
                <p class="font-bold text-shop-text text-lg">Cart khaali cha</p>
                <p class="text-sm mt-1">Kei halnu paryo? Browse gara ra ADD garidiye hunchha.</p>
              </div>
            } @else if (view() === 'cart') {
              <!-- Delivery card -->
              <div class="bg-white rounded-2xl p-4 shadow-card">
                <div class="flex items-start gap-3 mb-4">
                  <div
                    class="h-11 w-11 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-brand-primary/15 to-brand-secondary/15 text-brand-primary"
                  >
                    <i class="fas fa-stopwatch text-lg"></i>
                  </div>
                  <div class="flex flex-col leading-tight">
                    <span class="text-[15px] font-bold text-shop-text">
                      Delivery in 22 minutes
                    </span>
                    <span class="text-xs text-shop-mutedText">
                      Shipment of {{ cart.totalItems() }}
                      {{ cart.totalItems() === 1 ? 'item' : 'items' }}
                    </span>
                  </div>
                </div>

                <ul class="divide-y divide-gray-100">
                  @for (item of cart.cartItems(); track item.product.id) {
                    <li class="py-3 flex items-center gap-3 animate-fade-up">
                      <div class="h-16 w-16 shrink-0 rounded-xl border border-gray-200 overflow-hidden bg-shop-bg">
                        <app-custom-image
                          [src]="item.product.imageUrl"
                          [alt]="item.product.name"
                          aspectRatio="1 / 1"
                          radius="0"
                          objectFit="cover"
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-[13px] font-semibold text-shop-text line-clamp-2 leading-snug">
                          {{ item.product.name }}
                        </p>
                        <p class="text-[11px] text-shop-mutedText mt-0.5">
                          {{ item.product.size }}
                        </p>
                        <p class="text-sm font-bold text-shop-text mt-1">
                          ₹{{ item.product.price * item.qty }}
                          @if (item.product.mrp > item.product.price) {
                            <span class="text-[11px] font-medium text-shop-mutedText line-through ml-1">
                              ₹{{ item.product.mrp * item.qty }}
                            </span>
                          }
                        </p>
                      </div>
                      <div
                        class="inline-flex items-center h-9 rounded-lg text-white text-sm font-bold overflow-hidden shadow-soft"
                        style="background: linear-gradient(135deg, #7C3AED, #2563EB);"
                      >
                        <button
                          type="button"
                          (click)="dec(item.product.id)"
                          class="h-full w-8 flex items-center justify-center hover:bg-white/10 transition"
                          aria-label="Decrease"
                        >
                          −
                        </button>
                        <span class="w-6 text-center">{{ item.qty }}</span>
                        <button
                          type="button"
                          (click)="inc(item.product.id)"
                          class="h-full w-8 flex items-center justify-center hover:bg-white/10 transition"
                          aria-label="Increase"
                        >
                          +
                        </button>
                      </div>
                    </li>
                  }
                </ul>
              </div>

              <!-- Bill -->
              <div class="bg-white rounded-2xl p-4 shadow-card">
                <h3 class="text-[15px] font-bold text-shop-text mb-3">Bill details</h3>
                <dl class="space-y-2.5 text-sm">
                  <div class="flex items-center justify-between">
                    <dt class="flex items-center gap-2 text-shop-text">
                      <i class="fas fa-receipt text-shop-mutedText"></i>
                      Items total
                    </dt>
                    <dd class="font-semibold">₹{{ cart.itemsTotal() }}</dd>
                  </div>
                  <div class="flex items-center justify-between">
                    <dt class="flex items-center gap-2 text-shop-text">
                      <i class="fas fa-truck text-shop-mutedText"></i>
                      Delivery charge
                    </dt>
                    <dd class="font-semibold">₹{{ cart.deliveryCharge }}</dd>
                  </div>
                  <div class="flex items-center justify-between">
                    <dt class="flex items-center gap-2 text-shop-text">
                      <i class="fas fa-bag-shopping text-shop-mutedText"></i>
                      Handling charge
                    </dt>
                    <dd class="font-semibold">₹{{ cart.handlingCharge }}</dd>
                  </div>
                  @if (cart.smallCartFeeApplies()) {
                    <div class="flex items-center justify-between">
                      <dt class="flex items-center gap-2 text-shop-text">
                        <i class="fas fa-cart-shopping text-shop-mutedText"></i>
                        Small cart charge
                      </dt>
                      <dd class="font-semibold">₹{{ cart.smallCartCharge }}</dd>
                    </div>
                  }
                  <div class="border-t border-gray-200 pt-2.5 flex items-center justify-between">
                    <dt class="flex items-center gap-2 font-bold text-shop-text">
                      Grand total
                    </dt>
                    <dd class="font-bold text-base">₹{{ cart.grandTotal() }}</dd>
                  </div>
                  @if (cart.savings() > 0) {
                    <p
                      class="mt-2 px-3 py-2 rounded-lg text-xs font-semibold text-brand-primary bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10"
                    >
                      <i class="fas fa-circle-check mr-1.5"></i>
                      Tapai le yo order ma ₹{{ cart.savings() }} bachat garnu bhayo!
                    </p>
                  }
                </dl>
              </div>

              <!-- Cancellation Policy -->
              <div class="bg-white rounded-2xl p-4 shadow-card">
                <h3 class="text-[15px] font-bold text-shop-text mb-1.5">Cancellation Policy</h3>
                <p class="text-xs text-shop-mutedText leading-relaxed">
                  Orders cannot be cancelled once packed for delivery. In case of unexpected
                  delays, a refund will be provided, if applicable.
                </p>
              </div>
            } @else {
              <!-- CHECKOUT VIEW -->
              <div class="bg-white rounded-2xl p-4 shadow-card animate-fade-up">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="text-[15px] font-bold text-shop-text">Delivery address</h3>
                  <button type="button" class="text-xs font-semibold text-brand-primary hover:underline">
                    Change
                  </button>
                </div>
                <div class="flex items-start gap-3">
                  <div
                    class="h-9 w-9 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-brand-primary/15 to-brand-secondary/15 text-brand-primary"
                  >
                    <i class="fas fa-house"></i>
                  </div>
                  <div class="leading-tight">
                    <p class="text-sm font-semibold text-shop-text">Home</p>
                    <p class="text-xs text-shop-mutedText mt-0.5">
                      Hattiban, Mitrapur, Lalitpur 44700
                    </p>
                    <p class="text-xs text-shop-mutedText">
                      {{ auth.user()?.phone ? '+977 ' + auth.user()?.phone : '' }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-2xl p-4 shadow-card animate-fade-up">
                <h3 class="text-[15px] font-bold text-shop-text mb-3">Payment method</h3>
                <div class="space-y-2">
                  @for (opt of paymentOptions; track opt.id) {
                    <button
                      type="button"
                      (click)="selectedPayment.set(opt.id)"
                      [disabled]="opt.disabled"
                      [class]="paymentRowClass(opt.id, opt.disabled)"
                    >
                      <span
                        class="h-9 w-9 shrink-0 rounded-lg flex items-center justify-center"
                        [style.background]="
                          selectedPayment() === opt.id
                            ? 'linear-gradient(135deg, #7C3AED, #2563EB)'
                            : '#F3F4F6'
                        "
                        [class.text-white]="selectedPayment() === opt.id"
                        [class.text-shop-mutedText]="selectedPayment() !== opt.id"
                      >
                        <i [class]="opt.icon"></i>
                      </span>
                      <span class="flex-1 text-left">
                        <span class="block text-sm font-semibold text-shop-text">
                          {{ opt.label }}
                        </span>
                        <span class="block text-[11px] text-shop-mutedText">
                          {{ opt.hint }}
                        </span>
                      </span>
                      <span
                        class="h-5 w-5 rounded-full border-2 flex items-center justify-center"
                        [class.border-brand-primary]="selectedPayment() === opt.id"
                        [class.border-gray-300]="selectedPayment() !== opt.id"
                      >
                        @if (selectedPayment() === opt.id) {
                          <span
                            class="h-2.5 w-2.5 rounded-full"
                            style="background: linear-gradient(135deg, #7C3AED, #2563EB);"
                          ></span>
                        }
                      </span>
                    </button>
                  }
                </div>
              </div>

              <div class="bg-white rounded-2xl p-4 shadow-card animate-fade-up">
                <h3 class="text-[15px] font-bold text-shop-text mb-3">Order summary</h3>
                <dl class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <dt class="text-shop-mutedText">Items ({{ cart.totalItems() }})</dt>
                    <dd class="font-semibold">₹{{ cart.itemsTotal() }}</dd>
                  </div>
                  <div class="flex justify-between">
                    <dt class="text-shop-mutedText">Delivery + Handling</dt>
                    <dd class="font-semibold">
                      ₹{{ cart.deliveryCharge + cart.handlingCharge }}
                    </dd>
                  </div>
                  @if (cart.smallCartFeeApplies()) {
                    <div class="flex justify-between">
                      <dt class="text-shop-mutedText">Small cart charge</dt>
                      <dd class="font-semibold">₹{{ cart.smallCartCharge }}</dd>
                    </div>
                  }
                  <div class="flex justify-between border-t border-gray-200 pt-2 text-base">
                    <dt class="font-bold text-shop-text">To pay</dt>
                    <dd class="font-bold">₹{{ cart.grandTotal() }}</dd>
                  </div>
                </dl>
              </div>
            }
          </div>

          <!-- Sticky footer CTA -->
          @if (cart.cartItems().length > 0) {
            <footer class="sticky bottom-0 p-3 bg-[#F5F5F7]">
              @if (view() === 'cart') {
                <button
                  type="button"
                  (click)="proceedFromCart()"
                  class="w-full flex items-center justify-between px-5 py-4 rounded-xl text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
                  style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
                >
                  <div class="flex flex-col items-start leading-tight">
                    <span class="text-base font-extrabold">₹{{ cart.grandTotal() }}</span>
                    <span class="text-[11px] font-medium opacity-90">TOTAL</span>
                  </div>
                  <div class="flex items-center gap-2 text-[15px] font-bold">
                    {{ auth.isAuthenticated() ? 'Proceed to Pay' : 'Login to Proceed' }}
                    <i class="fas fa-chevron-right transition-transform group-hover:translate-x-1"></i>
                  </div>
                </button>
              } @else {
                <button
                  type="button"
                  [disabled]="placing()"
                  (click)="placeOrder()"
                  class="w-full flex items-center justify-between px-5 py-4 rounded-xl text-white shadow-lg transition-all duration-300 enabled:hover:-translate-y-0.5 disabled:opacity-80"
                  style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
                >
                  <div class="flex flex-col items-start leading-tight">
                    <span class="text-base font-extrabold">₹{{ cart.grandTotal() }}</span>
                    <span class="text-[11px] font-medium opacity-90">
                      {{ selectedPaymentLabel() }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-[15px] font-bold">
                    @if (placing()) {
                      <i class="fas fa-circle-notch fa-spin"></i>
                      Placing order…
                    } @else {
                      Place Order
                      <i class="fas fa-check"></i>
                    }
                  </div>
                </button>
              }
            </footer>
          }
        </section>
      </div>
    }
  `,
  styles: [
    `
      @keyframes slide-in-right {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
      .animate-slide-in-right {
        animation: slide-in-right 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
      }
    `
  ]
})
export class ShopCartDrawerComponent {
  protected readonly cart = inject(CartService);
  protected readonly auth = inject(AuthService);
  protected readonly order = inject(OrderService);

  protected readonly view = signal<DrawerView>('cart');
  protected readonly selectedPayment = signal<PaymentMethod>('cod');
  protected readonly placing = signal(false);
  private readonly pendingCheckout = signal(false);

  protected readonly paymentOptions: ReadonlyArray<{
    id: PaymentMethod;
    label: string;
    hint: string;
    icon: string;
    disabled: boolean;
  }> = [
    {
      id: 'cod',
      label: 'Cash on Delivery',
      hint: 'Ghar ma pugera paisa tirnus',
      icon: 'fas fa-money-bill-wave',
      disabled: false
    },
    {
      id: 'upi',
      label: 'UPI / eSewa / Khalti',
      hint: 'Aauna lageko — coming soon',
      icon: 'fas fa-mobile-screen-button',
      disabled: true
    },
    {
      id: 'card',
      label: 'Credit / Debit Card',
      hint: 'Coming soon',
      icon: 'fas fa-credit-card',
      disabled: true
    }
  ];

  constructor() {
    // Reset view each time drawer opens
    effect(() => {
      if (!this.cart.isOpen()) {
        this.view.set('cart');
        this.placing.set(false);
      }
    });

    // If user was mid-checkout when they had to log in, resume automatically
    effect(() => {
      if (this.auth.isAuthenticated() && this.pendingCheckout()) {
        this.pendingCheckout.set(false);
        this.view.set('checkout');
      }
    });
  }

  @HostListener('document:keydown.escape')
  protected close(): void {
    if (this.view() === 'checkout') {
      this.view.set('cart');
    } else {
      this.cart.closeDrawer();
    }
  }

  protected headerBack(): void {
    if (this.view() === 'checkout') {
      this.view.set('cart');
    } else {
      this.cart.closeDrawer();
    }
  }

  protected inc(id: string): void {
    const product = this.cart.cartItems().find(i => i.product.id === id)?.product;
    if (product) this.cart.add(product);
  }

  protected dec(id: string): void {
    this.cart.decrement(id);
  }

  protected proceedFromCart(): void {
    if (!this.auth.isAuthenticated()) {
      this.pendingCheckout.set(true);
      this.auth.openModal();
      return;
    }
    this.view.set('checkout');
  }

  protected selectedPaymentLabel(): string {
    const opt = this.paymentOptions.find(o => o.id === this.selectedPayment());
    return opt ? opt.label.toUpperCase() : '';
  }

  protected paymentRowClass(id: PaymentMethod, disabled: boolean): string {
    const selected = this.selectedPayment() === id;
    const base =
      'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200';
    if (disabled) {
      return `${base} border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed`;
    }
    return selected
      ? `${base} border-brand-primary bg-brand-primary/5 shadow-soft`
      : `${base} border-gray-200 hover:border-brand-primary/40 hover:bg-shop-bg`;
  }

  protected async placeOrder(): Promise<void> {
    if (this.placing()) return;
    this.placing.set(true);
    await this.order.placeOrder(this.cart.grandTotal(), this.selectedPayment());
    this.placing.set(false);
    // Cart is cleared when user dismisses success screen
  }
}
