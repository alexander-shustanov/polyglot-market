import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../api';

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

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

  const addToCart = async (productId: number) => {
    try {
      await api.addToCart(productId);
      alert('Product added to cart!');
    } catch (err) {
      alert('Failed to add product to cart');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h1>Products</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
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
            <p>{product.description}</p>
            <div className="product-price">${product.price}</div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to={`/products/${product.id}`}>
                <button className="btn btn-secondary">View Details</button>
              </Link>
              <button
                className="btn"
                onClick={() => addToCart(product.id)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;
