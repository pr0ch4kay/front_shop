import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const id = product.id || product._id;

  const addToCart = (e) => {
    e.preventDefault();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => (item.id || item._id) === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('✅ Товар добавлен в корзину!');
  };

  return (
    <Link to={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{
        background: '#2a2a2a',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid #3d3d3d',
        transition: 'all 0.3s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#ff6b35';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#3d3d3d';
        e.currentTarget.style.transform = 'translateY(0)';
      }}>
        <div style={{
          width: '100%',
          height: '150px',
          background: '#1a1a1a',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
          marginBottom: '12px',
        }}>
          {product.image ? (
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
          ) : (
            '📦'
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{product.brand}</div>
          <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px', height: '40px', overflow: 'hidden' }}>
            {product.name}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#ff6b35', fontWeight: '700', fontSize: '18px' }}>{product.price} ₽</span>
            <span style={{ fontSize: '12px', color: product.inStock ? '#4caf50' : '#f44336' }}>
              {product.inStock ? '✅ В наличии' : '❌ Нет'}
            </span>
          </div>
        </div>

        <button
          onClick={addToCart}
          disabled={!product.inStock}
          style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: product.inStock ? '#ff6b35' : '#444',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: product.inStock ? 'pointer' : 'not-allowed',
            fontWeight: '600',
            width: '100%',
            opacity: product.inStock ? 1 : 0.5,
          }}
        >
          {product.inStock ? '🛒 В корзину' : 'Нет в наличии'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;