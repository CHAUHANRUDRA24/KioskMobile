export interface Product {
  id: string;
  idCode: string;
  name: string;
  price: number;
  category: string;
  imageEmoji: string;
  type: 'fluid' | 'pill' | 'spray' | 'other';
  description: string;
  stockStatus: 'IN STOCK' | 'LOW STOCK';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ScreenType = 'landing' | 'products' | 'cart' | 'payment' | 'account';
