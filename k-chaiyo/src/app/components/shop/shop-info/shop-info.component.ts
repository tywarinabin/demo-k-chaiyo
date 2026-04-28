import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-shop-info',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block mt-auto' },
  template: `
    <section
      class="px-4 md:px-8 py-8 bg-white border-t border-gray-200 font-poppins animate-fade-up"
    >
      <h2 class="text-lg md:text-xl font-bold text-shop-text mb-2">
        {{ activeCategory().name }} Online
      </h2>
      <p class="text-sm text-shop-mutedText leading-relaxed max-w-4xl">
        K Chaiyo? le timlai Nepal ko best fresh products 22 minute bhitra tyahi delivery
        gardinchha. Hamro curated selection ma quality dairy, snacks, beverages, ra daily
        essentials cha — sabai trusted brands bata. Ghar bata order gara, hamilai tension
        chhoda. Timro convenience nai hamro mission ho.
      </p>
    </section>
  `
})
export class ShopInfoComponent {
  private readonly productService = inject(ProductService);
  protected readonly activeCategory = this.productService.activeCategory;
}
