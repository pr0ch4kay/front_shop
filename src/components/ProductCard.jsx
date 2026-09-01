import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCheck, FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const id = product._id || product.id;
  const [isFavorite, setIsFavorite] = useState(false);

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product.inStock) {
      toast.error('❌ Товар временно отсутствует');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => (item.id || item._id) === id);

    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ ...product, id: id, qty: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Красивое уведомление
    toast.custom((t) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#2a2a2a',
          color: '#fff',
          padding: '14px 20px',
          borderRadius: '12px',
          border: '1px solid #ff6b35',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          animation: 'slideIn 0.3s ease',
          maxWidth: '380px',
          width: '100%',
        }}
      >
        <div style={{
          background: '#ff6b35',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          flexShrink: 0,
        }}>
          <FaCheck />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>
            ✅ Добавлено в корзину!
          </div>
          <div style={{ color: '#ff6b35', fontWeight: '500', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name}
          </div>
          <div style={{ color: '#888', fontSize: '12px' }}>
            {product.price} ₽
          </div>
        </div>
        <div style={{ fontSize: '24px', opacity: 0.3, flexShrink: 0 }}>
          <FaShoppingCart />
        </div>
      </div>
    ), {
      duration: 3000,
      position: 'bottom-right',
    });

    // Обновляем счетчик
    window.dispatchEvent(new Event('cartUpdate'));
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <Link to={`/product/${id}`} className="product-card-link">
      <div className="product-card">
        {/* Избранное */}
        <button
          className="product-favorite"
          onClick={toggleFavorite}
          aria-label="В избранное"
        >
          {isFavorite ? <FaHeart style={{ color: '#ff6b35' }} /> : <FaRegHeart />}
        </button>

        {/* Изображение */}
        <div className="product-image">
          {product.image ? (
            <img src={product.image} alt={product.name} loading="lazy" />
          ) : (
            <span style={{ fontSize: '48px' }}>📦</span>
          )}
          {!product.inStock && (
            <div className="product-stock-badge out-of-stock">Нет в наличии</div>
          )}
          {product.inStock && product.stockQuantity < 5 && product.stockQuantity > 0 && (
            <div className="product-stock-badge last-items">Осталось {product.stockQuantity}</div>
          )}
        </div>

        {/* Информация */}
        <div className="product-info">
          <div className="product-brand">{product.brand || 'Без бренда'}</div>
          <div className="product-name">{product.name}</div>

          {product.rating > 0 && (
            <div className="product-rating">
              <span className="stars">⭐ {product.rating}</span>
              <span className="reviews">({product.reviewsCount || 0})</span>
            </div>
          )}

          <div className="product-bottom">
            <span className="product-price">{product.price} ₽</span>
            <span className={`product-stock ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {product.inStock ? '✅' : '❌'}
            </span>
          </div>
        </div>

        {/* Кнопка добавления */}
        <button
          className="product-btn"
          onClick={addToCart}
          disabled={!product.inStock}
        >
          {product.inStock ? '🛒 В корзину' : 'Нет в наличии'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;