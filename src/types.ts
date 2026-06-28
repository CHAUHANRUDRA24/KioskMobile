export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageEmoji: string;
  type: 'fluid' | 'pill' | 'spray' | 'other';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ScreenType = 'landing' | 'products' | 'cart' | 'payment';
