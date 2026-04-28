import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ShopProductCardComponent } from '../shop-product-card/shop-product-card.component';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-shop-product-grid',
  standalone: true,
  imports: [ShopProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col min-w-0' },
  template: `
    <section class="flex-1 flex flex-col min-w-0 px-4 md:px-8 py-6 font-poppins">
      <nav class="text-xs text-shop-mutedText mb-3" aria-label="Breadcrumb">
        <ol class="flex items-center gap-1">
          <li>Home</li>
          <li aria-hidden="true">/</li>
          <li class="text-shop-text font-medium">{{ activeCategory().name }}</li>
        </ol>
      </nav>

      <header class="flex items-center justify-between mb-4">
        <h1 class="text-xl md:text-2xl font-bold text-shop-text">
          {{ activeCategory().name }}
        </h1>
        <div class="hidden sm:flex items-center gap-2 text-xs text-shop-mutedText">
          <span>Sort & Filter</span>
        </div>
      </header>

      @if (products().length > 0) {
        <div
          class="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
        >
          @for (product of products(); track product.id) {
            <app-shop-product-card [product]="product" />
          }
        </div>
      } @else {
        <div
          class="flex-1 flex flex-col items-center justify-center py-16 text-shop-mutedText text-center animate-fade-in"
        >
          <div
            class="h-20 w-20 rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10"
          >
            <span class="text-3xl text-brand-primary">📦</span>
          </div>
          <p class="font-bold text-shop-text text-lg">Sabai products aairakchan</p>
          <p class="text-sm mt-1">Yo category ko listing thorai din ma ready hunchha.</p>
        </div>
      }
    </section>
  `
})
export class ShopProductGridComponent {
  private readonly productService = inject(ProductService);
  protected readonly products = this.productService.productsForActiveCategory;
  protected readonly activeCategory = this.productService.activeCategory;
}
