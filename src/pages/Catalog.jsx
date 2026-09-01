import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

const Catalog = ({ products }) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    brand: 'all',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    inStock: 'all',
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Получаем уникальные бренды и категории
  const brands = ['all', ...new Set(products.map(p => p.brand).filter(Boolean))];
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  useEffect(() => {
    applyFilters();
  }, [products, search, filters]);

  const applyFilters = () => {
    let result = [...products];

    // Поиск
    if (search) {
      const query = search.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query) ||
        p.flavor?.toLowerCase().includes(query)
      );
    }

    // Фильтр по бренду
    if (filters.brand !== 'all') {
      result = result.filter(p => p.brand === filters.brand);
    }

    // Фильтр по категории
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // Фильтр по цене
    if (filters.minPrice) {
      result = result.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    // Фильтр по наличию
    if (filters.inStock === 'inStock') {
      result = result.filter(p => p.inStock === true);
    } else if (filters.inStock === 'outOfStock') {
      result = result.filter(p => p.inStock === false);
    }

    setFilteredProducts(result);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      brand: 'all',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      inStock: 'all',
    });
    setSearch('');
  };

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      <h2 style={{ marginBottom: '16px' }}>📦 Каталог товаров</h2>
      
      {/* Поиск и кнопка фильтра */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '16px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="🔍 Поиск товаров..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
            }}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: '10px 20px',
            background: showFilters ? '#ff6b35' : '#2a2a2a',
            color: '#fff',
            border: '1px solid #444',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {showFilters ? '✕ Скрыть фильтры' : '🔽 Фильтры'}
          {(filters.brand !== 'all' || filters.category !== 'all' || filters.minPrice || filters.maxPrice || filters.inStock !== 'all') && (
            <span style={{
              background: '#ff6b35',
              color: '#fff',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: '700',
            }}>
              {[filters.brand !== 'all', filters.category !== 'all', filters.minPrice, filters.maxPrice, filters.inStock !== 'all'].filter(Boolean).length}
            </span>
          )}
        </button>
        {(filters.brand !== 'all' || filters.category !== 'all' || filters.minPrice || filters.maxPrice || filters.inStock !== 'all') && (
          <button
            onClick={resetFilters}
            style={{
              padding: '10px 16px',
              background: 'transparent',
              color: '#888',
              border: '1px solid #444',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Сбросить все
          </button>
        )}
      </div>

      {/* Панель фильтров */}
      {showFilters && (
        <div style={{
          background: '#2a2a2a',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid #444',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {/* Бренд */}
            <div className="filter-group">
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                color: '#888', 
                marginBottom: '4px',
                fontWeight: '500',
              }}>Бренд</label>
              <select
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                }}
              >
                {brands.map(b => (
                  <option key={b} value={b}>
                    {b === 'all' ? 'Все бренды' : b}
                  </option>
                ))}
              </select>
            </div>

            {/* Категория */}
            <div className="filter-group">
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                color: '#888', 
                marginBottom: '4px',
                fontWeight: '500',
              }}>Категория</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                }}
              >
                <option value="all">Все категории</option>
                {categories.filter(c => c !== 'all').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Цена от */}
            <div className="filter-group">
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                color: '#888', 
                marginBottom: '4px',
                fontWeight: '500',
              }}>Цена от</label>
              <input
                type="number"
                placeholder="0 ₽"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                }}
                min="0"
              />
            </div>

            {/* Цена до */}
            <div className="filter-group">
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                color: '#888', 
                marginBottom: '4px',
                fontWeight: '500',
              }}>Цена до</label>
              <input
                type="number"
                placeholder="9999 ₽"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                }}
                min="0"
              />
            </div>

            {/* Наличие */}
            <div className="filter-group">
              <label style={{ 
                display: 'block', 
                fontSize: '13px', 
                color: '#888', 
                marginBottom: '4px',
                fontWeight: '500',
              }}>Наличие</label>
              <select
                value={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#1a1a1a',
                  border: '1px solid #444',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                }}
              >
                <option value="all">Все</option>
                <option value="inStock">✅ В наличии</option>
                <option value="outOfStock">❌ Нет в наличии</option>
              </select>
            </div>
          </div>

          <div style={{ 
            marginTop: '16px', 
            display: 'flex', 
            justifyContent: 'flex-end',
            gap: '12px',
          }}>
            <button
              onClick={resetFilters}
              style={{
                padding: '8px 20px',
                background: 'transparent',
                color: '#888',
                border: '1px solid #444',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Сбросить
            </button>
            <button
              onClick={() => setShowFilters(false)}
              style={{
                padding: '8px 20px',
                background: '#ff6b35',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              Применить ✓
            </button>
          </div>
        </div>
      )}

      {/* Статистика */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        color: '#888',
        fontSize: '14px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <span>
          Найдено: <strong style={{ color: '#fff' }}>{filteredProducts.length}</strong> товаров
          {products.length > 0 && ` из ${products.length}`}
        </span>
        {filteredProducts.length === 0 && (
          <span style={{ color: '#f44336' }}>Попробуйте изменить параметры поиска</span>
        )}
      </div>

      {/* Список товаров */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '16px',
      }}>
        {filteredProducts.length === 0 ? (
          <div style={{ 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#888',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '18px', marginBottom: '8px' }}>Товары не найдены</p>
            <p style={{ fontSize: '14px' }}>Попробуйте изменить фильтры или поиск</p>
          </div>
        ) : (
          filteredProducts.map(p => (
            <ProductCard key={p._id || p.id} product={p} />
          ))
        )}
      </div>
    </div>
  );
};

export default Catalog;