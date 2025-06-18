export interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface CheckoutData {
  email: string;
  order_id: number;
  payment_id: string;
  products: CartItem[];
  total: number;
}
