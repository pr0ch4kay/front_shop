import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const HomePage = ({ products }) => {
  const featured = products.slice(0, 8);

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      {/* Герой-секция */}
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 0',
        borderBottom: '1px solid #333',
        marginBottom: '24px',
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>🛒 Nicotine Shop</h1>
        <p style={{ color: '#888', fontSize: '18px' }}>Качественная никотиновая продукция</p>
        <p style={{ color: '#666', fontSize: '14px', marginTop: '8px' }}>⚠️ Только для лиц старше 18 лет</p>
      </div>

      {/* Популярные товары */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>🔥 Популярные товары</h2>
          <Link to="/catalog" style={{ color: '#ff6b35', textDecoration: 'none' }}>
            Смотреть все →
          </Link>
        </div>

        {products.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>Нет товаров</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '16px',
          }}>
            {featured.map(p => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;