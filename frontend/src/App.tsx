import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import { api } from './api';

function App() {
    const location = useLocation();
    const [cartItemCount, setCartItemCount] = useState(0);

    // Fetch cart count for display in navigation
    useEffect(() => {
        const fetchCartCount = async () => {
            try {
                const cart = await api.getCart();
                const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
                setCartItemCount(totalItems);
            } catch (err) {
                console.error('Failed to fetch cart count:', err);
            }
        };

        fetchCartCount();
    }, [location.pathname]); // Refresh on route change

    return (
        <div className="app">
            <header className="header">
                <div className="container">
                    <nav className="nav">
                        <Link to="/products" style={{ textDecoration: 'none' }}>
                            <h1 style={{ margin: 0, color: '#1f2937' }}>🛍 Polyglot Shop</h1>
                        </Link>

                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <Link
                                to="/products"
                                style={{
                                    fontWeight: location.pathname === '/products' ? '600' : '500',
                                    color: location.pathname === '/products' ? '#2563eb' : '#374151'
                                }}
                            >
                                Products
                            </Link>

                            <Link
                                to="/cart"
                                style={{
                                    fontWeight: location.pathname === '/cart' ? '600' : '500',
                                    color: location.pathname === '/cart' ? '#2563eb' : '#374151',
                                    position: 'relative'
                                }}
                            >
                                Cart
                                {cartItemCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-12px',
                                        background: '#ef4444',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold'
                                    }}>
                                        {cartItemCount > 99 ? '99+' : cartItemCount}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </nav>
                </div>
            </header>

            <main className="container">
                <Routes>
                    <Route path="/" element={<ProductsPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                </Routes>
            </main>

            <footer style={{
                marginTop: '4rem',
                padding: '2rem 0',
                backgroundColor: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                textAlign: 'center',
                color: '#6b7280'
            }}>
                <div className="container">
                    <p>🛍 Polyglot Shop - Demo E-commerce with React, Django, Go & Spring Boot</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                        Built with ❤️ using modern polyglot architecture
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default App;
