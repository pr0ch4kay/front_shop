import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaCheck, FaShoppingCart, FaHeart, FaRegHeart, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { getProduct } from '../api/api';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      console.error('Ошибка загрузки товара:', err);
      setError('Товар не найден');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = () => {
    if (!product) return;

    if (!product.inStock) {
      toast.error('❌ Товар временно отсутствует');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const productId = product._id || product.id;
    const existing = cart.find(item => (item.id || item._id) === productId);

    if (existing) {
      existing.qty = (existing.qty || 1) + quantity;
    } else {
      cart.push({
        ...product,
        id: productId,
        _id: productId,
        qty: quantity,
      });
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
            {quantity} × {product.price} ₽ = {quantity * product.price} ₽
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

  const buyNow = () => {
    addToCart();
    setTimeout(() => navigate('/cart'), 500);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? '❌ Удалено из избранного' : '❤️ Добавлено в избранное', {
      duration: 1500,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="product-loading">
        <div className="loading-spinner"></div>
        <p>Загрузка товара...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-error">
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>😕</div>
        <h2>Товар не найден</h2>
        <p style={{ color: '#888' }}>Возможно, товар был удалён или вы перешли по неверной ссылке</p>
        <Link to="/catalog" className="btn-primary" style={{
          display: 'inline-block',
          marginTop: '20px',
          padding: '12px 32px',
          background: '#ff6b35',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontWeight: '600',
        }}>
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  const productId = product._id || product.id;
  const images = product.images?.length > 0 ? product.images : [product.image];
  const validImages = images.filter(img => img);

  return (
    <div className="product-page">
      {/* Хлебные крошки */}
      <div className="product-breadcrumb">
        <Link to="/">Главная</Link>
        <span>/</span>
        <Link to="/catalog">Каталог</Link>
        <span>/</span>
        <span className="current">{product.name}</span>
      </div>

      <div className="product-wrapper">
        {/* Галерея */}
        <div className="product-gallery">
          <div className="product-main-image">
            {validImages.length > 0 ? (
              <img
                src={validImages[selectedImage]}
                alt={product.name}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '📦';
                }}
              />
            ) : (
              <span style={{ fontSize: '80px' }}>📦</span>
            )}
            {!product.inStock && (
              <div className="product-stock-overlay">Нет в наличии</div>
            )}
          </div>

          {validImages.length > 1 && (
            <div className="product-thumbnails">
              {validImages.map((img, index) => (
                <button
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div className="product-info-block">
          <div className="product-header">
            <div className="product-brand-category">
              <span className="brand">{product.brand || 'Без бренда'}</span>
              {product.category && (
                <>
                  <span className="separator">•</span>
                  <span className="category">{product.category}</span>
                </>
              )}
            </div>

            <button
              className="product-favorite-btn"
              onClick={toggleFavorite}
              aria-label="В избранное"
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          <h1 className="product-title">{product.name}</h1>

          {product.rating > 0 && (
            <div className="product-rating-block">
              <div className="stars">
                {'⭐'.repeat(Math.floor(product.rating))}
                {product.rating % 1 > 0 && '⭐'}
              </div>
              <span className="rating-value">{product.rating}</span>
              <span className="reviews-count">({product.reviewsCount || 0} отзывов)</span>
            </div>
          )}

          <div className="product-price-block">
            <span className="price">{product.price} ₽</span>
            <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {product.inStock ? '✅ В наличии' : '❌ Нет в наличии'}
            </span>
            {product.inStock && product.stockQuantity < 10 && (
              <span className="stock-warning">Осталось {product.stockQuantity} шт.</span>
            )}
          </div>

          {product.description && (
            <div className="product-description">
              <h3>Описание</h3>
              <p>{product.description}</p>
            </div>
          )}

          <div className="product-characteristics">
            <h3>Характеристики</h3>
            <div className="chars-grid">
              {product.nicotine > 0 && (
                <div className="char-item">
                  <span className="char-label">Крепость</span>
                  <span className="char-value">{product.nicotine} мг</span>
                </div>
              )}
              {product.flavor && (
                <div className="char-item">
                  <span className="char-label">Вкус</span>
                  <span className="char-value">{product.flavor}</span>
                </div>
              )}
              {product.weight > 0 && (
                <div className="char-item">
                  <span className="char-label">Вес</span>
                  <span className="char-value">{product.weight} г</span>
                </div>
              )}
              {product.brand && (
                <div className="char-item">
                  <span className="char-label">Бренд</span>
                  <span className="char-value">{product.brand}</span>
                </div>
              )}
              {product.createdAt && (
                <div className="char-item">
                  <span className="char-label">Добавлен</span>
                  <span className="char-value">{formatDate(product.createdAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Количество и кнопки */}
          <div className="product-actions">
            <div className="quantity-selector">
              <label>Количество</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={!product.inStock || (product.stockQuantity && quantity >= product.stockQuantity)}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button
                className="btn-add-to-cart"
                onClick={addToCart}
                disabled={!product.inStock}
              >
                <FaShoppingCart /> Добавить в корзину
              </button>
              <button
                className="btn-buy-now"
                onClick={buyNow}
                disabled={!product.inStock}
              >
                Купить сейчас
              </button>
            </div>
          </div>

          <button
            className="btn-back"
            onClick={() => navigate('/catalog')}
          >
            <FaArrowLeft /> Вернуться в каталог
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;