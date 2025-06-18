import { Routes, Route, Link } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <Link to="/products">
              <h1>Polyglot Shop</h1>
            </Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
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
    </div>
  );
}

export default App;
