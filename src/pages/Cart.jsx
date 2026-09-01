import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = ({ onCartUpdate }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const items = JSON.parse(saved);
        setCart(items);
        setTotal(items.reduce((sum, item) => sum + item.price * item.qty, 0));
      } catch {
        setCart([]);
        setTotal(0);
      }
    } else {
      setCart([]);
      setTotal(0);
    }
  };

  const updateCart = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart));
    setCart(newCart);
    setTotal(newCart.reduce((sum, item) => sum + item.price * item.qty, 0));
    if (onCartUpdate) onCartUpdate();
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter(item => (item.id || item._id) !== id);
    updateCart(newCart);
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    const newCart = cart.map(item => {
      const itemId = item.id || item._id;
      if (itemId === id) {
        return { ...item, qty };
      }
      return item;
    });
    updateCart(newCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        textAlign: 'center', 
        padding: '60px 16px' 
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛒</div>
        <h2 style={{ marginBottom: '8px' }}>Корзина пуста</h2>
        <p style={{ color: '#888', marginBottom: '24px' }}>
          Добавьте товары в корзину, чтобы оформить заказ
        </p>
        <Link to="/catalog" style={{
          display: 'inline-block',
          padding: '12px 32px',
          background: '#ff6b35',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
        }}>
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
      <h2 style={{ marginBottom: '16px' }}>🛒 Корзина</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {cart.map(item => {
          const itemId = item.id || item._id;
          return (
            <div key={itemId} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#2a2a2a',
              padding: '12px 16px',
              borderRadius: '8px',
              flexWrap: 'wrap',
              gap: '8px',
            }}>
              <div style={{ flex: 1, minWidth: '120px' }}>
                <div style={{ fontWeight: '500' }}>{item.name}</div>
                <div style={{ color: '#ff6b35', fontWeight: '600' }}>{item.price} ₽</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => updateQty(itemId, item.qty - 1)}
                  style={{
                    background: '#444',
                    color: '#fff',
                    border: 'none',
                    width: '30px',
                    height: '30px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  −
                </button>
                <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.qty}</span>
                <button 
                  onClick={() => updateQty(itemId, item.qty + 1)}
                  style={{
                    background: '#444',
                    color: '#fff',
                    border: 'none',
                    width: '30px',
                    height: '30px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  +
                </button>
                <button 
                  onClick={() => removeFromCart(itemId)}
                  style={{
                    background: 'transparent',
                    color: '#f44336',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '18px',
                    padding: '0 8px',
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ fontWeight: '600', minWidth: '80px', textAlign: 'right' }}>
                {item.price * item.qty} ₽
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        background: '#2a2a2a',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <span style={{ color: '#888' }}>Итого:</span>
          <span style={{ fontSize: '24px', fontWeight: '700', marginLeft: '8px', color: '#ff6b35' }}>
            {total} ₽
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={clearCart}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              color: '#f44336',
              border: '1px solid #f44336',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Очистить
          </button>
          <Link to="/catalog" style={{
            padding: '10px 20px',
            background: 'transparent',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '8px',
            textDecoration: 'none',
            cursor: 'pointer',
          }}>
            Продолжить покупки
          </Link>
          <button 
            onClick={() => navigate('/checkout')}
            style={{
              padding: '10px 24px',
              background: '#ff6b35',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;