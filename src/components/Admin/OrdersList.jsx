import React, { useState } from 'react';

const OrdersList = ({ orders, onStatusChange, loading }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const statusColors = {
    pending: '#ff9800',
    confirmed: '#2196f3',
    processing: '#9c27b0',
    shipped: '#4caf50',
    delivered: '#4caf50',
    cancelled: '#e74c3c',
  };

  const statusLabels = {
    pending: '⏳ Ожидает',
    confirmed: '✅ Подтверждён',
    processing: '🔄 В обработке',
    shipped: '🚚 Отправлен',
    delivered: '📦 Доставлен',
    cancelled: '❌ Отменён',
  };

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Функция для форматирования даты
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Не указана';
    try {
      const date = new Date(dateStr + 'T00:00:00');
      const day = date.getDate();
      const month = date.toLocaleString('ru', { month: 'long' });
      const weekDay = date.toLocaleString('ru', { weekday: 'long' });
      return `${day} ${month}, ${weekDay}`;
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center', color: '#888' }}>Загрузка заказов...</p>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#888',
        background: '#2a2a2a',
        borderRadius: 12,
      }}>
        <p>📭 Заказов пока нет</p>
        <p style={{ fontSize: '14px', marginTop: '8px' }}>
          Заказы появятся здесь после оформления покупки
        </p>
      </div>
    );
  }

  return (
    <div>
      {orders.map(order => {
        const orderId = order._id || order.id;
        const isExpanded = expandedOrder === orderId;
        const delivery = order.delivery || {};

        return (
          <div key={orderId} style={{
            background: '#2a2a2a',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '12px',
            border: '1px solid #3d3d3d',
          }}>
            {/* Заголовок заказа */}
            <div 
              onClick={() => toggleExpand(orderId)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '600' }}>
                  Заказ #{String(orderId).slice(-6)}
                </span>
                <span style={{ fontSize: '12px', color: '#888' }}>
                  {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: statusColors[order.status] || '#888',
                  fontWeight: '600',
                }}>
                  {statusLabels[order.status] || order.status}
                </span>
                {/* Показываем дату получения в заголовке */}
                {delivery.date && (
                  <span style={{
                    fontSize: '11px',
                    color: '#4caf50',
                    background: 'rgba(76, 175, 80, 0.1)',
                    padding: '2px 10px',
                    borderRadius: '12px',
                  }}>
                    📅 {formatDate(delivery.date)}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: '700', color: '#ff6b35' }}>
                  {order.totalPrice} ₽
                </span>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  {isExpanded ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {/* Детали заказа */}
            {isExpanded && (
              <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #3d3d3d',
              }}>
                {/* Информация о клиенте */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  marginBottom: '12px',
                  background: '#1a1a1a',
                  padding: '12px',
                  borderRadius: '6px',
                }}>
                  <div>
                    <span style={{ color: '#888', fontSize: '12px' }}>👤 Имя</span>
                    <div style={{ fontWeight: '500' }}>{order.customer?.name || 'Не указано'}</div>
                  </div>
                  <div>
                    <span style={{ color: '#888', fontSize: '12px' }}>📱 Телефон</span>
                    <div style={{ fontWeight: '500' }}>{order.customer?.phone || 'Не указан'}</div>
                  </div>
                  <div>
                    <span style={{ color: '#888', fontSize: '12px' }}>📅 Дата получения</span>
                    <div style={{ fontWeight: '500', color: delivery.date ? '#4caf50' : '#888' }}>
                      {delivery.date ? formatDate(delivery.date) : 'Не указана'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#888', fontSize: '12px' }}>🕐 Время получения</span>
                    <div style={{ fontWeight: '500', color: delivery.time ? '#4caf50' : '#888' }}>
                      {delivery.time || 'Не указано'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: '#888', fontSize: '12px' }}>📦 Способ получения</span>
                    <div style={{ fontWeight: '500' }}>{delivery.method || 'Не указан'}</div>
                  </div>
                  <div>
                    <span style={{ color: '#888', fontSize: '12px' }}>📝 Комментарий</span>
                    <div style={{ fontWeight: '500' }}>{order.comment || 'Нет комментария'}</div>
                  </div>
                </div>

                {/* Товары в заказе */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>📦 Товары:</div>
                  {order.items?.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '4px 0',
                      fontSize: '14px',
                      borderBottom: i < order.items.length - 1 ? '1px solid #2a2a2a' : 'none',
                    }}>
                      <span>{item.name}</span>
                      <span style={{ color: '#888' }}>
                        {item.quantity} × {item.price} ₽ = <strong style={{ color: '#ff6b35' }}>
                          {item.quantity * item.price} ₽
                        </strong>
                      </span>
                    </div>
                  ))}
                </div>

                {/* Изменение статуса */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexWrap: 'wrap',
                  paddingTop: '12px',
                  borderTop: '1px solid #3d3d3d',
                }}>
                  <span style={{ color: '#888', fontSize: '13px' }}>Статус:</span>
                  <select
                    value={order.status}
                    onChange={e => onStatusChange(orderId, e.target.value)}
                    style={{
                      background: '#1a1a1a',
                      color: '#fff',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      padding: '4px 12px',
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="pending">⏳ Ожидает</option>
                    <option value="confirmed">✅ Подтверждён</option>
                    <option value="processing">🔄 В обработке</option>
                    <option value="shipped">🚚 Отправлен</option>
                    <option value="delivered">📦 Доставлен</option>
                    <option value="cancelled">❌ Отменён</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrdersList;