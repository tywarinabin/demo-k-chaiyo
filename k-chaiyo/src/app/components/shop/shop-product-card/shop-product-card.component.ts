import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core';
import { CustomImageComponent } from '../../../shared/custom-image/custom-image.component';
import { Product } from '../../../shared/models/product.model';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-shop-product-card',
  standalone: true,
  imports: [CustomImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="group relative flex flex-col rounded-2xl border border-gray-200 bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-cardHover hover:border-brand-primary/30 font-poppins animate-fade-up"
    >
      @if (product.discountPercent > 0) {
        <div
          class="absolute -top-1 left-3 z-10 select-none"
          [attr.aria-label]="'Discount ' + product.discountPercent + ' percent'"
        >
          <div
            class="relative px-2 pt-1.5 pb-4 text-center text-white shadow-[0_4px_12px_rgba(124,58,237,0.35)]"
            style="
              background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);
              clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 82%, 0 100%);
              min-width: 44px;
            "
          >
            <div class="text-[12px] font-extrabold leading-none">
              {{ product.discountPercent }}%
            </div>
            <div class="text-[9px] font-bold tracking-wider leading-none mt-0.5">
              OFF
            </div>
          </div>
        </div>
      }

      <app-custom-image
        [src]="product.imageUrl"
        [alt]="product.name"
        aspectRatio="1 / 1"
        radius="12px"
        objectFit="cover"
        containerClass="bg-shop-bg"
      />

      <div class="mt-3 flex flex-col gap-1">
        <h3
          class="text-[13px] font-semibold leading-snug text-shop-text line-clamp-2 min-h-[34px]"
        >
          {{ product.name }}
        </h3>
        <p class="text-xs text-shop-mutedText">{{ product.size }}</p>
      </div>

      <div class="mt-3 flex items-center justify-between gap-2">
        <div class="flex flex-col leading-tight">
          <span class="text-sm font-bold text-shop-text">₹{{ product.price }}</span>
          @if (product.mrp > product.price) {
            <span class="text-xs text-shop-mutedText line-through">
              MRP ₹{{ product.mrp }}
            </span>
          }
        </div>

        @if (qty() === 0) {
          <button
            type="button"
            (click)="add()"
            class="inline-flex items-center justify-center min-w-[64px] h-9 px-3 rounded-lg text-[12px] font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 border border-brand-primary/30 hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-secondary hover:text-white hover:border-transparent transition-all duration-200 active:scale-95"
            [attr.aria-label]="'Add ' + product.name"
          >
            ADD
          </button>
        } @else {
          <div
            class="inline-flex items-center h-9 rounded-lg text-white text-sm font-bold overflow-hidden shadow-soft animate-pop"
            style="background: linear-gradient(135deg, #7C3AED 0%, #2563EB 100%);"
          >
            <button
              type="button"
              (click)="dec()"
              class="h-full w-8 flex items-center justify-center hover:bg-white/10 transition"
              aria-label="Decrease"
            >
              −
            </button>
            <span class="w-6 text-center" aria-live="polite">{{ qty() }}</span>
            <button
              type="button"
              (click)="add()"
              class="h-full w-8 flex items-center justify-center hover:bg-white/10 transition"
              aria-label="Increase"
            >
              +
            </button>
          </div>
        }
      </div>
    </article>
  `
})
export class ShopProductCardComponent {
  @Input({ required: true }) product!: Product;
  private readonly cart = inject(CartService);

  protected readonly qty = computed(() => this.cart.getQty(this.product?.id));

  protected add(): void {
    this.cart.add(this.product);
  }

  protected dec(): void {
    this.cart.decrement(this.product.id);
  }
}
