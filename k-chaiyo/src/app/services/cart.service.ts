import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../shared/models/product.model';

export interface CartItem {
  product: Product;
  qty: number;
}

/**
 * Signal-based cart with derived bill totals and drawer visibility.
 * Pure client state — persistence belongs in a future HTTP adapter.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly items = signal<Map<string, CartItem>>(new Map());
  private readonly drawerOpen = signal(false);

  readonly deliveryCharge = 25;
  readonly handlingCharge = 2;
  readonly smallCartThreshold = 149;
  readonly smallCartCharge = 20;

  readonly cartItems = computed<ReadonlyArray<CartItem>>(() =>
    Array.from(this.items().values())
  );

  readonly totalItems = computed(() =>
    this.cartItems().reduce((sum, it) => sum + it.qty, 0)
  );

  readonly itemsTotal = computed(() =>
    this.cartItems().reduce((sum, it) => sum + it.qty * it.product.price, 0)
  );

  readonly itemsMrpTotal = computed(() =>
    this.cartItems().reduce((sum, it) => sum + it.qty * it.product.mrp, 0)
  );

  readonly savings = computed(() => this.itemsMrpTotal() - this.itemsTotal());

  readonly smallCartFeeApplies = computed(
    () => this.itemsTotal() > 0 && this.itemsTotal() < this.smallCartThreshold
  );

  readonly grandTotal = computed(() => {
    const items = this.itemsTotal();
    if (items === 0) return 0;
    return (
      items +
      this.deliveryCharge +
      this.handlingCharge +
      (this.smallCartFeeApplies() ? this.smallCartCharge : 0)
    );
  });

  readonly isOpen = this.drawerOpen.asReadonly();

  getQty(productId: string): number {
    return this.items().get(productId)?.qty ?? 0;
  }

  add(product: Product): void {
    this.items.update(map => {
      const next = new Map(map);
      const existing = next.get(product.id);
      next.set(product.id, { product, qty: (existing?.qty ?? 0) + 1 });
      return next;
    });
  }

  decrement(productId: string): void {
    this.items.update(map => {
      const next = new Map(map);
      const existing = next.get(productId);
      if (!existing) return next;
      if (existing.qty <= 1) {
        next.delete(productId);
      } else {
        next.set(productId, { ...existing, qty: existing.qty - 1 });
      }
      return next;
    });
  }

  remove(productId: string): void {
    this.items.update(map => {
      const next = new Map(map);
      next.delete(productId);
      return next;
    });
  }

  clear(): void {
    this.items.set(new Map());
  }

  openDrawer(): void {
    this.drawerOpen.set(true);
  }

  closeDrawer(): void {
    this.drawerOpen.set(false);
  }
}
