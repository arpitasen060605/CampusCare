import axios from 'axios';

// Get API Base URL from environment variables (defaults to /api proxied by Vite or http://localhost:5000/api)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api` 
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors & token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// 1. Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// 2. AI Analysis & Duplicate API
export const aiAPI = {
  analyze: (payload) => api.post('/ai/analyze', payload),
  checkDuplicate: (payload) => api.post('/ai/check-duplicate', payload),
};

// 3. Complaints API
export const complaintsAPI = {
  create: (formData) => {
    const isFormData = formData instanceof FormData;
    return api.post('/complaints', formData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },
  getAll: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  update: (id, data) => api.put(`/complaints/${id}`, data),
  delete: (id) => api.delete(`/complaints/${id}`),
  assign: (id, staffId) => api.put(`/complaints/${id}/assign`, { staffId }),
  updateStatus: (id, status) => api.put(`/complaints/${id}/status`, { status }),
  resolve: (id, resolutionData) => {
    const isFormData = resolutionData instanceof FormData;
    return api.post(`/complaints/${id}/resolve`, resolutionData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
  },
};

// 4. Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getStaff: () => api.get('/users/staff'),
};

// 5. Analytics API
export const analyticsAPI = {
  getDashboard: (range) => api.get('/analytics/dashboard', { params: { range } }),
  getDepartments: () => api.get('/analytics/departments'),
  getCategories: () => api.get('/analytics/categories'),
};

export default api;
