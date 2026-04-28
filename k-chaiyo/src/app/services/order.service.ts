import { Injectable, signal } from '@angular/core';

export type PaymentMethod = 'cod' | 'upi' | 'card';

export interface PlacedOrder {
  id: string;
  totalPaid: number;
  payment: PaymentMethod;
  placedAt: Date;
  etaMinutes: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _lastOrder = signal<PlacedOrder | null>(null);
  private readonly _successOpen = signal(false);

  readonly lastOrder = this._lastOrder.asReadonly();
  readonly isSuccessOpen = this._successOpen.asReadonly();

  placeOrder(total: number, payment: PaymentMethod): Promise<PlacedOrder> {
    return new Promise(resolve =>
      setTimeout(() => {
        const order: PlacedOrder = {
          id: 'KC' + Math.floor(100000 + Math.random() * 900000),
          totalPaid: total,
          payment,
          placedAt: new Date(),
          etaMinutes: 22
        };
        this._lastOrder.set(order);
        this._successOpen.set(true);
        resolve(order);
      }, 900)
    );
  }

  dismissSuccess(): void {
    this._successOpen.set(false);
  }
}
