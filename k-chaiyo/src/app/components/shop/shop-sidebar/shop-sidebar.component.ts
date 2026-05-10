import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { ShopCategory } from '../../../shared/models/product.model';

@Component({
  selector: 'app-shop-sidebar',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Mobile: horizontal chip strip (sticks at top of content) -->
    <nav
      class="md:hidden w-full sticky top-0 z-20 bg-white border-b border-gray-200 overflow-x-auto scrollbar-hide font-poppins shrink-0"
      aria-label="Categories"
    >
      <ul class="flex gap-2 px-3 py-2.5 min-w-max">
        @for (cat of categories; track cat.id) {
          <li>
            <button
              type="button"
              (click)="selectCategory(cat.id)"
              [ngClass]="[
                'inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap border transition-all duration-200 active:scale-95',
                isActive(cat.id)
                  ? 'text-white border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.3)]'
                  : 'bg-white text-shop-mutedText border-gray-200 hover:border-brand-primary/40 hover:text-brand-primary'
              ]"
              [style.background]="
                isActive(cat.id)
                  ? 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)'
                  : null
              "
              [attr.aria-current]="isActive(cat.id) ? 'true' : null"
            >
              <i [class]="cat.icon" class="text-[12px]"></i>
              {{ cat.name }}
            </button>
          </li>
        }
      </ul>
    </nav>

    <!-- Desktop: compact vertical rail (sticky in the outer scroll container) -->
    <aside
      class="hidden md:flex flex-col w-[80px] lg:w-[88px] shrink-0 bg-white border-r border-gray-200 font-poppins sticky top-0 self-start h-[calc(100vh-60px)] sm:h-[calc(100vh-72px)] overflow-y-auto scrollbar-thin"
      aria-label="Categories"
    >
      <ul class="flex flex-col py-1">
        @for (cat of categories; track cat.id) {
          <li>
            <button
              type="button"
              (click)="selectCategory(cat.id)"
              [ngClass]="[
                'relative w-full flex flex-col items-center justify-center gap-1.5 px-1.5 py-3 text-center transition-colors duration-200',
                isActive(cat.id)
                  ? 'bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10'
                  : 'hover:bg-shop-bg'
              ]"
              [attr.aria-current]="isActive(cat.id) ? 'true' : null"
            >
              @if (isActive(cat.id)) {
                <span
                  class="absolute left-0 top-0 bottom-0 w-[3px] rounded-r"
                  style="background: linear-gradient(180deg, #7C3AED, #2563EB);"
                  aria-hidden="true"
                ></span>
              }
              <span
                [ngClass]="[
                  'flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-all duration-200',
                  isActive(cat.id)
                    ? 'text-white shadow-[0_4px_12px_rgba(124,58,237,0.3)] scale-105'
                    : 'bg-shop-bg text-shop-mutedText'
                ]"
                [style.background]="
                  isActive(cat.id)
                    ? 'linear-gradient(135deg, #7C3AED 0%, #2563EB 100%)'
                    : null
                "
              >
                <i [class]="cat.icon"></i>
              </span>
              <span
                [ngClass]="[
                  'text-[10px] leading-tight line-clamp-2 w-full px-0.5',
                  isActive(cat.id) ? 'font-semibold text-shop-text' : 'text-shop-mutedText'
                ]"
              >
                {{ cat.name }}
              </span>
            </button>
          </li>
        }
      </ul>
    </aside>
  `,
  styles: [
    `
      .scrollbar-thin::-webkit-scrollbar {
        width: 4px;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb {
        background: #e5e7eb;
        border-radius: 4px;
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `
  ]
})
export class ShopSidebarComponent {
  private readonly productService = inject(ProductService);
  protected readonly categories: ReadonlyArray<ShopCategory> = this.productService.categories;
  private readonly activeId = this.productService.getActiveCategoryId();

  protected isActive(id: string): boolean {
    return this.activeId() === id;
  }

  protected selectCategory(id: string): void {
    this.productService.setActiveCategory(id);
  }
}
