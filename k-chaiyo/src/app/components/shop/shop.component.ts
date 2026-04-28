import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ShopHeaderComponent } from './shop-header/shop-header.component';
import { ShopSidebarComponent } from './shop-sidebar/shop-sidebar.component';
import { ShopProductGridComponent } from './shop-product-grid/shop-product-grid.component';
import { ShopInfoComponent } from './shop-info/shop-info.component';
import { ShopCartDrawerComponent } from './shop-cart-drawer/shop-cart-drawer.component';
import { ShopAuthModalComponent } from './shop-auth-modal/shop-auth-modal.component';
import { ShopOrderSuccessComponent } from './shop-order-success/shop-order-success.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    ShopHeaderComponent,
    ShopSidebarComponent,
    ShopProductGridComponent,
    ShopInfoComponent,
    ShopCartDrawerComponent,
    ShopAuthModalComponent,
    ShopOrderSuccessComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-screen flex flex-col bg-shop-bg font-poppins">
      <!-- Fixed Header (stays at top, never moves) -->
      <app-shop-header class="fixed top-0 left-0 right-0 h-[60px] sm:h-[72px] z-50" />
      
      <!-- Main Layout: Sidebar + Content (takes remaining space below header) -->
      <div class="flex-1 flex flex-col md:flex-row mt-[60px] sm:mt-[72px] bg-white overflow-hidden">
        <!-- Sidebar: Horizontal on mobile (md:hidden), Vertical on desktop -->
        <app-shop-sidebar />
        
        <!-- Scrollable Content Area -->
        <div class="flex-1 min-w-0 flex flex-col overflow-y-auto">
          <app-shop-product-grid class="flex-1" />
          <app-shop-info />
        </div>
      </div>
      
      <app-shop-cart-drawer />
      <app-shop-auth-modal />
      <app-shop-order-success />
    </div>
  `
})
export class ShopComponent {}
