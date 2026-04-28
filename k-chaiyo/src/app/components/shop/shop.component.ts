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
    <div class="flex flex-col min-h-screen bg-shop-bg font-poppins">
      <app-shop-header />
      <div class="flex-1 w-full md:flex bg-white">
        <app-shop-sidebar />
        <div class="flex-1 min-w-0 flex flex-col">
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
