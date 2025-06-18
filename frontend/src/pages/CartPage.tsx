import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cart } from '../types';
import { api } from '../api';
import QuantityControl from '../components/QuantityControl';

function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [checkingOut, setCheckingOut] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

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

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId: number, newQuantity: number) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await api.updateCartItem(productId, newQuantity);
      await fetchCart(); // Refresh cart
    } catch (err) {
      alert('Failed to update cart item');
      console.error(err);
    } finally {
      setUpdatingItems(prev => {
        const updated = new Set(prev);
        updated.delete(productId);
        return updated;
      });
    }
  };

  const removeItem = async (productId: number) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await api.removeFromCart(productId);
      await fetchCart(); // Refresh cart
    } catch (err) {
      alert('Failed to remove item from cart');
      console.error(err);
    } finally {
      setUpdatingItems(prev => {
        const updated = new Set(prev);
        updated.delete(productId);
        return updated;
      });
    }
  };

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
        await fetchCart();
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
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products">
            <button className="btn">Continue Shopping</button>
          </Link>
        </div>
      ) : (
        <>
          <div>
            {cart.items.map((item) => {
              const isUpdating = updatingItems.has(item.product.id);
              return (
                <div
                  key={item.id}
                  className={`cart-item ${isUpdating ? 'updating' : ''}`}
                >
                  <div className="cart-item-info">
                    <Link to={`/products/${item.product.id}`}>
                      <h3 className="cart-item-title">{item.product.name}</h3>
                    </Link>
                    <p className="cart-item-description">
                      {item.product.description.length > 100
                        ? `${item.product.description.substring(0, 100)}...`
                        : item.product.description
                      }
                    </p>
                    <div className="cart-item-price">
                      ${item.product.price} each
                    </div>
                  </div>
                  
                  <div className="cart-item-controls">
                    <div className="cart-item-total">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    <QuantityControl
                      quantity={item.quantity}
                      onQuantityChange={(newQuantity) => updateQuantity(item.product.id, newQuantity)}
                      onRemove={() => removeItem(item.product.id)}
                      disabled={isUpdating}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-total">
            <h2>Total: ${cart.total.toFixed(2)}</h2>
            <p style={{ marginBottom: '1rem', color: '#6b7280' }}>
              {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/products">
                <button className="btn btn-secondary">Continue Shopping</button>
              </Link>
              <button
                className="btn"
                onClick={handleCheckout}
                disabled={checkingOut || updatingItems.size > 0}
                style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
              >
                {checkingOut ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
