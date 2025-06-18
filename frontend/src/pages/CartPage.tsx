import { useState, useEffect } from 'react';
import { Cart } from '../types';
import { api } from '../api';

function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await api.getCart();
        setCart(data);
      } catch (err) {
        setError('Failed to load cart');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }

    setCheckingOut(true);
    try {
      const result = await api.checkout();
      if (result.success) {
        alert(`Order placed successfully! Payment ID: ${result.payment_id}`);
        // Refresh cart after successful checkout
        const updatedCart = await api.getCart();
        setCart(updatedCart);
      } else {
        alert('Checkout failed. Please try again.');
      }
    } catch (err) {
      alert('Checkout failed. Please try again.');
      console.error(err);
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1>Shopping Cart</h1>
      
      {!cart || cart.items.length === 0 ? (
        <div className="cart-total">
          <p>Your cart is empty</p>
          <a href="/products">
            <button className="btn">Continue Shopping</button>
          </a>
        </div>
      ) : (
        <>
          <div>
            {cart.items.map((item) => (
              <div key={item.id} className="cart-item">
                <div>
                  <h3>{item.product.name}</h3>
                  <p>{item.product.description}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div>
                  <strong>${(item.product.price * item.quantity).toFixed(2)}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <h2>Total: ${cart.total.toFixed(2)}</h2>
            <button
              className="btn"
              onClick={handleCheckout}
              disabled={checkingOut}
              style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
            >
              {checkingOut ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
