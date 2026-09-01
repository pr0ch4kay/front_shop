import React, { useState, useEffect } from 'react';
import { getOrders, deleteProduct, updateOrderStatus } from '../api/api';
import ProductForm from '../components/Admin/ProductForm';
import OrdersList from '../components/Admin/OrdersList';

const Admin = ({ products, onRefresh }) => {
  const [tab, setTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (tab === 'orders') loadOrders();
  }, [tab]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getOrders();
      console.log('📋 Заказы получены:', data);
      setOrders(data);
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
      alert('❌ Ошибка загрузки заказов: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить этот товар?')) return;
    try {
      await deleteProduct(id);
      alert('✅ Товар удалён');
      onRefresh();
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      loadOrders();
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    }
  };

  return (
    <div className="admin-panel" style={{ padding: '16px 0' }}>
      <div className="admin-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <h2>⚙️ Админ-панель</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${tab === 'products' ? 'btn-success' : 'btn-outline'}`}
            onClick={() => setTab('products')}
            style={{
              padding: '8px 16px',
              background: tab === 'products' ? '#ff6b35' : 'transparent',
              color: tab === 'products' ? '#fff' : '#888',
              border: '1px solid #444',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            📦 Товары ({products.length})
          </button>
          <button 
            className={`btn ${tab === 'orders' ? 'btn-success' : 'btn-outline'}`}
            onClick={() => setTab('orders')}
            style={{
              padding: '8px 16px',
              background: tab === 'orders' ? '#ff6b35' : 'transparent',
              color: tab === 'orders' ? '#fff' : '#888',
              border: '1px solid #444',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            📋 Заказы ({orders.length})
          </button>
        </div>
      </div>

      {tab === 'products' && (
        <>
          <ProductForm 
            product={editingProduct}
            onSave={() => {
              setEditingProduct(null);
              onRefresh();
            }}
            onCancel={() => setEditingProduct(null)}
          />

          <div style={{ marginTop: 16 }}>
            {products.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>Нет товаров</p>
            ) : (
              products.map(p => (
                <div key={p._id || p.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#2a2a2a',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  border: '1px solid #3d3d3d',
                }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{p.name}</div>
                    <div style={{ color: '#ff6b35', fontWeight: '600' }}>{p.price} ₽</div>
                    <div style={{ fontSize: '12px', color: p.inStock ? '#4caf50' : '#f44336' }}>
                      {p.inStock ? '✅ В наличии' : '❌ Нет в наличии'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button 
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        border: '1px solid #ff6b35',
                        borderRadius: '4px',
                        color: '#ff6b35',
                        cursor: 'pointer',
                      }}
                      onClick={() => setEditingProduct(p)}
                    >
                      ✏️
                    </button>
                    <button 
                      style={{
                        padding: '6px 12px',
                        background: 'transparent',
                        border: '1px solid #f44336',
                        borderRadius: '4px',
                        color: '#f44336',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleDelete(p._id || p.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {tab === 'orders' && (
        <OrdersList 
          orders={orders} 
          onStatusChange={handleStatusChange}
          onRefresh={loadOrders}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Admin;