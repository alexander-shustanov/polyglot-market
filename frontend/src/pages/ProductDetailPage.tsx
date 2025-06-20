import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../api';
import SimilarProducts from '../components/SimilarProducts';

function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

            try {
                const data = await api.getProduct(parseInt(id));
                setProduct(data);
            } catch (err) {
                setError('Failed to load product');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        if (!product) return;

        setAddingToCart(true);
        try {
            await api.addToCart(product.id, quantity);
            alert(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to cart!`);
        } catch (err) {
            alert('Failed to add product to cart');
            console.error(err);
        } finally {
            setAddingToCart(false);
        }
    };

    const addToCartAndGoToCart = async () => {
        if (!product) return;

        setAddingToCart(true);
        try {
            await api.addToCart(product.id, quantity);
            navigate('/cart');
        } catch (err) {
            alert('Failed to add product to cart');
            console.error(err);
            setAddingToCart(false);
        }
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (value > 0 && !isNaN(value)) {
            setQuantity(value);
        }
    };

    if (loading) return <div className="loading">Loading product...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!product) return <div className="error">Product not found</div>;

    return (
        <div>
            <nav style={{ marginBottom: '2rem' }}>
                <Link to="/products" style={{ color: '#2563eb', textDecoration: 'none' }}>
                    ← Back to Products
                </Link>
            </nav>

            <div className="product-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                {product.image_url && (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-image"
                        style={{ height: '400px', width: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                    />
                )}

                <div style={{ padding: '1rem' }}>
                    <h1 className="product-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        {product.name}
                    </h1>

                    <p style={{ fontSize: '1.1rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                        {product.description}
                    </p>

                    <div className="product-price" style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
                        ${product.price}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <label htmlFor="quantity" style={{ fontWeight: '600' }}>
                            Quantity:
                        </label>
                        <div className="quantity-input-group">
                            <button
                                className="quantity-btn"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={addingToCart || quantity <= 1}
                            >
                                −
                            </button>
                            <input
                                id="quantity"
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                className="quantity-input"
                                min="1"
                                disabled={addingToCart}
                            />
                            <button
                                className="quantity-btn"
                                onClick={() => setQuantity(quantity + 1)}
                                disabled={addingToCart}
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <button
                            className="btn"
                            onClick={addToCart}
                            disabled={addingToCart}
                            style={{ flex: '1', minWidth: '200px' }}
                        >
                            {addingToCart ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={addToCartAndGoToCart}
                            disabled={addingToCart}
                            style={{ flex: '1', minWidth: '200px' }}
                        >
                            {addingToCart ? 'Adding...' : 'Buy Now'}
                        </button>
                    </div>

                    <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                        <h3 style={{ marginBottom: '0.5rem', color: '#374151' }}>Product Details</h3>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ padding: '0.25rem 0', borderBottom: '1px solid #e5e7eb' }}>
                                <strong>Product ID:</strong> #{product.id}
                            </li>
                            <li style={{ padding: '0.25rem 0', borderBottom: '1px solid #e5e7eb' }}>
                                <strong>Price:</strong> ${product.price}
                            </li>
                            <li style={{ padding: '0.25rem 0' }}>
                                <strong>Total for {quantity} item{quantity > 1 ? 's' : ''}:</strong> ${(parseFloat(product.price.toString()) * quantity).toFixed(2)}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* TODO: Implement similar products functionality */}
            <SimilarProducts productId={product.id} />
        </div>
    );
}

export default ProductDetailPage;
