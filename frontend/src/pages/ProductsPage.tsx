import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../api';

function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [addingToCart, setAddingToCart] = useState<Set<number>>(new Set());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data);
            } catch (err) {
                setError('Failed to load products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const addToCart = async (productId: number, event: React.MouseEvent) => {
        event.preventDefault(); // Prevent navigation to product page
        event.stopPropagation();

        setAddingToCart(prev => new Set(prev).add(productId));
        try {
            await api.addToCart(productId);
            alert('Product added to cart!');
        } catch (err) {
            alert('Failed to add product to cart');
            console.error(err);
        } finally {
            setAddingToCart(prev => {
                const updated = new Set(prev);
                updated.delete(productId);
                return updated;
            });
        }
    };

    if (loading) return <div className="loading">Loading products...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <h1>Products</h1>
            <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
                Discover our wide range of technology products. Click on any product to view details.
            </p>

            <div className="products-grid">
                {products.map((product) => {
                    const isAdding = addingToCart.has(product.id);
                    return (
                        <div key={product.id} className="product-card">
                            <Link to={`/products/${product.id}`} className="product-card-link">
                                {product.image_url && (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="product-image"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
                                        }}
                                    />
                                )}
                                <h3 className="product-title">{product.name}</h3>
                                <p style={{ marginBottom: '1rem' }}>
                                    {product.description.length > 120
                                        ? `${product.description.substring(0, 120)}...`
                                        : product.description
                                    }
                                </p>
                                <div className="product-price">${product.price}</div>
                            </Link>

                            <div className="product-card-actions">
                                <Link to={`/products/${product.id}`}>
                                    <button className="btn btn-secondary">View Details</button>
                                </Link>
                                <button
                                    className="btn"
                                    onClick={(e) => addToCart(product.id, e)}
                                    disabled={isAdding}
                                >
                                    {isAdding ? 'Adding...' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {products.length === 0 && !loading && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
                    <h2>No products available</h2>
                    <p>Please check back later for new products.</p>
                </div>
            )}
        </div>
    );
}

export default ProductsPage;
