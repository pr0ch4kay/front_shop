import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('🔗 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Перехватчик запросов
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error(`❌ Ошибка: ${error.message}`);
    return Promise.reject(error);
  }
);

export default api;

// ============ API МЕТОДЫ ============

// ----- Аутентификация -----
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  verify: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout'),
};

// ----- Товары -----
export const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// ----- Заказы -----
export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const createOrder = async (data) => {
  const response = await api.post('/orders', data);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.patch(`/orders/${id}/status`, { status });
  return response.data;
};

// ----- Пользователи -----
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// ----- Статистика -----
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};