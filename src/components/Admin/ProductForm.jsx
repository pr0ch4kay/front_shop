import React, { useState, useEffect } from 'react';
import { createProduct, updateProduct } from '../../api/api';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    nicotine: '',
    flavor: '',
    inStock: true,
    image: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        price: product.price || '',
        nicotine: product.nicotine || '',
        flavor: product.flavor || '',
        inStock: product.inStock !== undefined ? product.inStock : true,
        image: product.image || '',
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        nicotine: parseInt(form.nicotine) || 0,
      };

      if (product) {
        await updateProduct(product.id, data);
        alert('✅ Товар обновлён');
      } else {
        await createProduct(data);
        alert('✅ Товар добавлен');
      }
      onSave();
    } catch (err) {
      alert('❌ Ошибка: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ background: '#2a2a2a', padding: 16, borderRadius: 12 }}>
      <h4>{product ? 'Редактировать' : 'Добавить товар'}</h4>

      <div className="form-group">
        <label>Название</label>
        <input 
          value={form.name} 
          onChange={e => setForm({ ...form, name: e.target.value })} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Цена (₽)</label>
        <input 
          type="number" 
          value={form.price} 
          onChange={e => setForm({ ...form, price: e.target.value })} 
          required 
        />
      </div>

      <div className="form-group">
        <label>Крепость (мг)</label>
        <input 
          type="number" 
          value={form.nicotine} 
          onChange={e => setForm({ ...form, nicotine: e.target.value })} 
        />
      </div>

      <div className="form-group">
        <label>Вкус</label>
        <input 
          value={form.flavor} 
          onChange={e => setForm({ ...form, flavor: e.target.value })} 
        />
      </div>

      <div className="form-group">
        <label>Ссылка на фото</label>
        <input 
          value={form.image} 
          onChange={e => setForm({ ...form, image: e.target.value })} 
          placeholder="https://..."
        />
      </div>

      <div className="form-group">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input 
            type="checkbox" 
            checked={form.inStock} 
            onChange={e => setForm({ ...form, inStock: e.target.checked })} 
          />
          В наличии
        </label>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" className="btn btn-success">
          {product ? 'Обновить' : 'Добавить'}
        </button>
        {product && (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};

export default ProductForm;