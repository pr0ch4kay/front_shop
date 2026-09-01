import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct } from '../api/api';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
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
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const productId = product._id || product.id;
    const existing = cart.find(item => (item.id || item._id) === productId);
    
    if (existing) {
      existing.qty += quantity;
    } else {
      cart.push({ 
        ...product, 
        id: productId,
        _id: productId,
        qty: quantity 
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`✅ Товар "${product.name}" добавлен в корзину!`);
  };

  const buyNow = () => {
    addToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <p>⏳ Загрузка товара...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <h2>Товар не найден</h2>
        <p style={{ color: '#888' }}>Возможно, товар был удалён или вы перешли по неверной ссылке</p>
        <Link to="/catalog" style={{
          display: 'inline-block',
          marginTop: '16px',
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

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px' }}>
      {/* Хлебные крошки */}
      <div style={{ 
        fontSize: '14px', 
        color: '#888', 
        marginBottom: '20px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
      }}>
        <Link to="/" style={{ color: '#888', textDecoration: 'none' }}>Главная</Link>
        <span>/</span>
        <Link to="/catalog" style={{ color: '#888', textDecoration: 'none' }}>Каталог</Link>
        <span>/</span>
        <span style={{ color: '#fff' }}>{product.name}</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        background: '#2a2a2a',
        padding: '30px',
        borderRadius: '12px',
        border: '1px solid #3d3d3d',
      }}>
        {/* Фото товара */}
        <div>
          <div style={{
            background: '#1a1a1a',
            borderRadius: '12px',
            overflow: 'hidden',
            height: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                }}
              />
            ) : (
              <span style={{ fontSize: '80px' }}>📦</span>
            )}
          </div>
          
          {/* Миниатюры (если есть) */}
          {product.images && product.images.length > 0 && (
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '12px',
            }}>
              {product.images.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    border: '1px solid #444',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Информация о товаре */}
        <div>
          <div style={{ 
            fontSize: '12px', 
            color: '#888', 
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '8px',
          }}>
            {product.brand || 'Без бренда'}
          </div>
          
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{product.name}</h1>
          
          {/* Рейтинг */}
          {product.rating > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ color: '#ff9800' }}>⭐ {product.rating}</span>
              <span style={{ color: '#888', fontSize: '14px' }}>
                ({product.reviewsCount || 0} отзывов)
              </span>
            </div>
          )}

          {/* Цена */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
            padding: '16px',
            background: '#1a1a1a',
            borderRadius: '8px',
          }}>
            <span style={{ fontSize: '32px', fontWeight: '700', color: '#ff6b35' }}>
              {product.price} ₽
            </span>
            <span style={{
              fontSize: '14px',
              color: product.inStock ? '#4caf50' : '#f44336',
              fontWeight: '600',
            }}>
              {product.inStock ? '✅ В наличии' : '❌ Нет в наличии'}
            </span>
          </div>

          {/* Описание */}
          {product.description && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#888' }}>Описание</h3>
              <p style={{ color: '#ccc', lineHeight: '1.6' }}>{product.description}</p>
            </div>
          )}

          {/* Характеристики */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#888' }}>Характеристики</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4px 16px',
              background: '#1a1a1a',
              padding: '12px 16px',
              borderRadius: '8px',
            }}>
              {product.nicotine > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#888' }}>Крепость:</span>
                  <span>{product.nicotine} мг</span>
                </div>
              )}
              {product.flavor && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#888' }}>Вкус:</span>
                  <span>{product.flavor}</span>
                </div>
              )}
              {product.weight > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#888' }}>Вес:</span>
                  <span>{product.weight} г</span>
                </div>
              )}
              {product.category && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span style={{ color: '#888' }}>Категория:</span>
                  <span>{product.category}</span>
                </div>
              )}
            </div>
          </div>

          {/* Количество и кнопки */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ color: '#888' }}>Количество:</span>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#444',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                −
              </button>
              <span style={{ minWidth: '32px', textAlign: 'center', fontWeight: '600' }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '32px',
                  height: '32px',
                  background: '#444',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                +
              </button>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={addToCart}
                disabled={!product.inStock}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: product.inStock ? '#ff6b35' : '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  opacity: product.inStock ? 1 : 0.5,
                  minWidth: '150px',
                }}
              >
                🛒 В корзину
              </button>
              <button
                onClick={buyNow}
                disabled={!product.inStock}
                style={{
                  flex: 1,
                  padding: '14px 24px',
                  background: product.inStock ? '#4caf50' : '#444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  opacity: product.inStock ? 1 : 0.5,
                  minWidth: '150px',
                }}
              >
                🔥 Купить сейчас
              </button>
            </div>
          </div>

          {/* Кнопка назад */}
          <button
            onClick={() => navigate('/catalog')}
            style={{
              marginTop: '16px',
              padding: '10px 20px',
              background: 'transparent',
              color: '#888',
              border: '1px solid #444',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              width: '100%',
            }}
          >
            ← Вернуться в каталог
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;