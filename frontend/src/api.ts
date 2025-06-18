import axios from 'axios';
import { Product, Cart } from './types';

const API_BASE = '/api';
const PAYMENT_API = 'http://localhost:8080';

export const api = {
  // Products
  getProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE}/products/`);
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_BASE}/products/${id}/`);
    return response.data;
  },

  // Cart
  getCart: async (): Promise<Cart> => {
    const response = await axios.get(`${API_BASE}/cart/1/`);
    return response.data;
  },

  addToCart: async (productId: number, quantity: number = 1): Promise<void> => {
    await axios.post(`${API_BASE}/cart/add/`, {
      product_id: productId,
      quantity,
    });
  },

  // Checkout
  checkout: async (): Promise<{ success: boolean; payment_id?: string }> => {
    try {
      const response = await axios.post(`${PAYMENT_API}/checkout`, {
        user_id: 1,
      });
      return response.data;
    } catch (error) {
      console.error('Checkout failed:', error);
      return { success: false };
    }
  },
};
