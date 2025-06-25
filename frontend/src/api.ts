import axios from 'axios';
import { Product, Cart } from './types';

const CART_API_BASE = '/api/market';
const PAYMENT_API = '/api/payment';

export const api = {
    // Products
    getProducts: async (): Promise<Product[]> => {
        const response = await axios.get(`${CART_API_BASE}/products/`);
        return response.data;
    },

    getProduct: async (id: number): Promise<Product> => {
        const response = await axios.get(`${CART_API_BASE}/products/${id}/`);
        return response.data;
    },

    // Cart
    getCart: async (): Promise<Cart> => {
        const response = await axios.get(`${CART_API_BASE}/cart/1/`);
        return response.data;
    },

    addToCart: async (productId: number, quantity: number = 1): Promise<void> => {
        await axios.post(`${CART_API_BASE}/cart/add/`, {
            product_id: productId,
            quantity,
        });
    },

    updateCartItem: async (productId: number, quantity: number): Promise<void> => {
        await axios.post(`${CART_API_BASE}/cart/add/`, {
            product_id: productId,
            quantity,
            replace: true, // Заменить количество, а не добавить
        });
    },

    removeFromCart: async (productId: number): Promise<void> => {
        await axios.delete(`${CART_API_BASE}/cart/remove/${productId}/`);
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

    clearCart: async () => {
        await axios.delete(`${CART_API_BASE}/cart/1/`);
    }
};
