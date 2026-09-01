import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/api';

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    deliveryDate: '',
    deliveryTime: '',
    deliveryMethod: 'Самовывоз',
    comment: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        const items = JSON.parse(saved);
        setCart(items);
        setTotal(items.reduce((sum, item) => sum + item.price * item.qty, 0));
      } catch {
        // ignore
      }
    } else {
      navigate('/cart');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Валидация
    if (!form.name || !form.phone) {
      alert('❌ Заполните имя и телефон!');
      return;
    }
    if (!form.deliveryDate) {
      alert('❌ Выберите дату получения!');
      return;
    }
    if (!form.deliveryTime) {
      alert('❌ Выберите время получения!');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        userId: 'telegram_user',
        userData: {
          firstName: form.name,
        },
        items: cart.map(item => ({
          productId: item.id || item._id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
        })),
        customer: {
          name: form.name,
          phone: form.phone,
        },
        delivery: {
          date: form.deliveryDate,      // ✅ дата
          time: form.deliveryTime,      // ✅ время
          method: form.deliveryMethod,
        },
        comment: form.comment || '',
        totalPrice: total,
        status: 'pending',
      };

      console.log('📤 Отправка заказа:', orderData); // Для отладки

      const response = await createOrder(orderData);
      console.log('✅ Заказ создан:', response);

      localStorage.removeItem('cart');
      alert('✅ Заказ оформлен!');
      navigate('/');
    } catch (err) {
      console.error('❌ Ошибка:', err);
      alert('❌ Ошибка при оформлении заказа: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Генерируем доступные даты (сегодня + 7 дней)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      dates.push(`${year}-${month}-${day}`);
    }
    return dates;
  };

  // Генерируем доступное время (с 10:00 до 20:00)
  const getAvailableTimes = () => {
    const times = [];
    for (let hour = 10; hour <= 20; hour++) {
      const h = hour.toString().padStart(2, '0');
      times.push(`${h}:00`);
      if (hour < 20) {
        times.push(`${h}:30`);
      }
    }
    return times;
  };

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        <p>Корзина пуста</p>
        <button onClick={() => navigate('/catalog')} className="btn" style={{
          padding: '12px 32px',
          background: '#ff6b35',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '12px',
        }}>В каталог</button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '0 16px' }}>
      <h2 style={{ marginBottom: '16px' }}>📋 Оформление заказа</h2>

      {/* Список товаров */}
      <div style={{
        background: '#2a2a2a',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '16px',
        border: '1px solid #444',
      }}>
        <h4 style={{ marginBottom: '8px', color: '#888' }}>Ваш заказ:</h4>
        {cart.map(item => (
          <div key={item.id || item._id} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '4px 0',
            fontSize: '14px',
          }}>
            <span>{item.name} x{item.qty}</span>
            <span style={{ color: '#ff6b35' }}>{item.price * item.qty} ₽</span>
          </div>
        ))}
        <div style={{
          borderTop: '1px solid #444',
          paddingTop: '12px',
          marginTop: '8px',
          fontWeight: '700',
          fontSize: '18px',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <span>Итого:</span>
          <span style={{ color: '#ff6b35' }}>{total} ₽</span>
        </div>
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit}>
        {/* Имя */}
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#888', marginBottom: '4px' }}>
            👤 Ваше имя *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Введите ваше имя"
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a1a',
              border: '1px solid #444',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
            }}
            required
          />
        </div>

        {/* Телефон */}
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#888', marginBottom: '4px' }}>
            📱 Телефон для связи *
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="+7 (999) 123-45-67"
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a1a',
              border: '1px solid #444',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
            }}
            required
          />
        </div>

        {/* Дата получения */}
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#888', marginBottom: '4px' }}>
            📅 Дата получения *
          </label>
          <select
            value={form.deliveryDate}
            onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a1a',
              border: '1px solid #444',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
            }}
            required
          >
            <option value="">Выберите дату</option>
            {getAvailableDates().map(date => {
              const d = new Date(date + 'T00:00:00');
              const day = d.getDate();
              const month = d.toLocaleString('ru', { month: 'long' });
              const weekDay = d.toLocaleString('ru', { weekday: 'long' });
              return (
                <option key={date} value={date}>
                  {day} {month}, {weekDay}
                </option>
              );
            })}
          </select>
        </div>

        {/* Время получения */}
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#888', marginBottom: '4px' }}>
            🕐 Время получения *
          </label>
          <select
            value={form.deliveryTime}
            onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a1a',
              border: '1px solid #444',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
            }}
            required
          >
            <option value="">Выберите время</option>
            {getAvailableTimes().map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        {/* Способ получения */}
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#888', marginBottom: '4px' }}>
            📦 Способ получения
          </label>
          <select
            value={form.deliveryMethod}
            onChange={(e) => setForm({ ...form, deliveryMethod: e.target.value })}
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a1a',
              border: '1px solid #444',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
            }}
          >
            <option value="Самовывоз">🏪 Самовывоз</option>
            <option value="Курьер">🚚 Курьер</option>
            <option value="Почта">📮 Почта России</option>
          </select>
        </div>

        {/* Комментарий */}
        <div className="form-group" style={{ marginBottom: '12px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#888', marginBottom: '4px' }}>
            📝 Комментарий к заказу
          </label>
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Дополнительные пожелания..."
            rows="3"
            style={{
              width: '100%',
              padding: '12px',
              background: '#1a1a1a',
              border: '1px solid #444',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              resize: 'vertical',
              minHeight: '60px',
            }}
          />
        </div>

        {/* Кнопки */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid #444',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Назад
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: '#ff6b35',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? 'Оформление...' : '✅ Подтвердить заказ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;