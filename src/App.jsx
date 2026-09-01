import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { getProducts } from './api/api';

import HomePage from './pages/HomePage';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductPage from './pages/ProductPage';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function AppContent() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);
  const [clickTimer, setClickTimer] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    loadProducts();
    loadCart();
    checkAdmin();

    // Слушаем обновления корзины
    window.addEventListener('cartUpdate', loadCart);
    return () => {
      window.removeEventListener('cartUpdate', loadCart);
    };
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data.items || []);
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const items = JSON.parse(saved);
        setCartCount(items.reduce((sum, item) => sum + (item.qty || 1), 0));
      } else {
        setCartCount(0);
      }
    } catch (e) {
      console.error('Ошибка загрузки корзины:', e);
      setCartCount(0);
    }
  };

  const checkAdmin = () => {
    const token = localStorage.getItem('adminToken');
    setIsAdmin(!!token);
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newCount = secretClicks + 1;
    setSecretClicks(newCount);

    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    const timer = setTimeout(() => {
      if (newCount >= 5) {
        setSecretClicks(0);
        if (isAdmin) {
          localStorage.removeItem('adminToken');
          setIsAdmin(false);
          alert('🔒 Вы вышли из админ-панели');
          window.location.reload();
        } else {
          const password = prompt('🔑 Введите пароль администратора:');
          if (password === 'admin123') {
            localStorage.setItem('adminToken', 'admin-token');
            setIsAdmin(true);
            alert('✅ Добро пожаловать в админ-панель!');
            window.location.reload();
          } else if (password !== null) {
            alert('❌ Неверный пароль!');
          }
        }
      } else {
        navigate('/');
      }
      setSecretClicks(0);
      setClickTimer(null);
    }, 1000);

    setClickTimer(timer);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#1a1a1a',
        color: '#fff',
        fontSize: '18px',
        padding: '20px',
      }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⏳</div>
        <p>Загрузка магазина...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Toaster для уведомлений */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#2a2a2a',
            color: '#fff',
            border: '1px solid #ff6b35',
            borderRadius: '12px',
            padding: '16px 20px',
            maxWidth: '400px',
          },
          success: {
            icon: '✅',
          },
          error: {
            icon: '❌',
            style: {
              border: '1px solid #f44336',
            },
          },
        }}
      />

      {/* ===== ХЕДЕР ===== */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div
              className="logo"
              onClick={handleLogoClick}
              title="1 клик - на главную, 5 кликов - админ-панель"
            >
              <span className="logo-icon">💨</span>
              <span className="logo-text">Nicotine Shop</span>
              {isAdmin && <span className="logo-badge">АДМИН</span>}
            </div>

            <nav className="nav">
              <Link to="/" className="nav-link">Главная</Link>
              <Link to="/catalog" className="nav-link">Каталог</Link>
              <Link to="/cart" className="nav-link-cart">
                🛒 Корзина
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
              {isAdmin && (
                <Link to="/admin" className="nav-link-admin">⚙️ Админ</Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* ===== ОСНОВНОЙ КОНТЕНТ ===== */}
      <main className="main-content">
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage products={products} />} />
            <Route path="/catalog" element={<Catalog products={products} />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<Cart onCartUpdate={loadCart} />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin products={products} onRefresh={loadProducts} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>

      {/* ===== ФУТЕР ===== */}
      <footer className="footer">
        <div className="container">
          <p>© 2024 Nicotine Shop. Только для лиц старше 18 лет. ⚠️ Курение вредит здоровью.</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;