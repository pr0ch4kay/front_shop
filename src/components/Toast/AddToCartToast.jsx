import React from 'react';
import toast from 'react-hot-toast';
import { FaCheck, FaShoppingCart } from 'react-icons/fa';

export const showAddToCartToast = (productName, productPrice) => {
  toast.custom((t) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: '#2a2a2a',
        color: '#fff',
        padding: '16px 24px',
        borderRadius: '12px',
        border: '1px solid #ff6b35',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        animation: 'slideIn 0.3s ease',
        maxWidth: '400px',
        width: '100%',
      }}
    >
      <div style={{
        background: '#ff6b35',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
      }}>
        <FaCheck />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '600', fontSize: '15px' }}>
          Добавлено в корзину!
        </div>
        <div style={{ color: '#ff6b35', fontWeight: '500', fontSize: '13px' }}>
          {productName}
        </div>
        <div style={{ color: '#888', fontSize: '12px' }}>
          {productPrice} ₽
        </div>
      </div>
      <div style={{ fontSize: '28px', opacity: 0.3 }}>
        <FaShoppingCart />
      </div>
    </div>
  ), {
    duration: 3000,
    position: 'bottom-right',
  });
};