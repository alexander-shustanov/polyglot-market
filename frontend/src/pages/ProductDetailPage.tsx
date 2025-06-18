import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { api } from '../api';
import SimilarProducts from '../components/SimilarProducts';

function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

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
    
    try {
      await api.addToCart(product.id);
      alert('Product added to cart!');
    } catch (err) {
      alert('Failed to add product to cart');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div>
      <Link to="/products" style={{ marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Products
      </Link>
      
      <div className="product-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-image"
            style={{ height: '400px' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
            }}
          />
        )}
        <h1 className="product-title">{product.name}</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          {product.description}
        </p>
        <div className="product-price" style={{ fontSize: '2rem' }}>
          ${product.price}
        </div>
        <button className="btn" onClick={addToCart}>
          Add to Cart
        </button>
      </div>

      {/* TODO: Implement similar products functionality */}
      <SimilarProducts productId={product.id} />
    </div>
  );
}

export default ProductDetailPage;
