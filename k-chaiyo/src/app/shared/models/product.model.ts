export interface Product {
  id: string;
  name: string;
  size: string;
  imageUrl: string;
  mrp: number;
  price: number;
  discountPercent: number;
  categoryId: string;
}

export interface ShopCategory {
  id: string;
  name: string;
  icon: string;
  imageUrl?: string;
}
