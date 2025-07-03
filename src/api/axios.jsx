import axios from 'axios';
import { auth } from '../firebase';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden - insufficient permissions
          console.error('Access forbidden:', data.message);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data.message);
          break;
        case 500:
          // Server error
          console.error('Server error:', data.message);
          break;
        default:
          console.error('API Error:', data.message || 'Unknown error');
      }
      
      return Promise.reject(error);
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

// API helper functions
export const apiHelpers = {
  // Auth endpoints
  auth: {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    logout: () => api.post('/auth/logout'),
    refreshToken: () => api.post('/auth/refresh'),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  },

  // User endpoints
  users: {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    uploadAvatar: (formData) => api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    deleteAccount: () => api.delete('/users/account'),
  },

  // Trip endpoints
  trips: {
    getAll: (params) => api.get('/trips', { params }),
    getById: (id) => api.get(`/trips/${id}`),
    create: (tripData) => api.post('/trips', tripData),
    update: (id, tripData) => api.put(`/trips/${id}`, tripData),
    delete: (id) => api.delete(`/trips/${id}`),
    join: (id) => api.post(`/trips/${id}/join`),
    leave: (id) => api.post(`/trips/${id}/leave`),
  },

  // Pool endpoints
  pools: {
    getAll: (params) => api.get('/pools', { params }),
    getById: (id) => api.get(`/pools/${id}`),
    create: (poolData) => api.post('/pools', poolData),
    update: (id, poolData) => api.put(`/pools/${id}`, poolData),
    delete: (id) => api.delete(`/pools/${id}`),
    join: (id) => api.post(`/pools/${id}/join`),
    leave: (id) => api.post(`/pools/${id}/leave`),
  },

  // Driver endpoints
  drivers: {
    getAll: (params) => api.get('/drivers', { params }),
    getById: (id) => api.get(`/drivers/${id}`),
    updateProfile: (data) => api.put('/drivers/profile', data),
    getEarnings: (params) => api.get('/drivers/earnings', { params }),
    getRides: (params) => api.get('/drivers/rides', { params }),
    updateAvailability: (data) => api.put('/drivers/availability', data),
  },

  // Guide endpoints
  guides: {
    getAll: (params) => api.get('/guides', { params }),
    getById: (id) => api.get(`/guides/${id}`),
    updateProfile: (data) => api.put('/guides/profile', data),
    getTours: (params) => api.get('/guides/tours', { params }),
    getBookings: (params) => api.get('/guides/bookings', { params }),
    updateAvailability: (data) => api.put('/guides/availability', data),
  },

  // Location endpoints
  locations: {
    search: (query) => api.get('/locations/search', { params: { q: query } }),
    getPopular: () => api.get('/locations/popular'),
    getDetails: (id) => api.get(`/locations/${id}`),
    getNearby: (lat, lng, radius) => api.get('/locations/nearby', { 
      params: { lat, lng, radius } 
    }),
  },

  // Messaging endpoints
  messages: {
    getConversations: () => api.get('/messages/conversations'),
    getMessages: (conversationId) => api.get(`/messages/${conversationId}`),
    sendMessage: (conversationId, message) => api.post(`/messages/${conversationId}`, message),
    markAsRead: (conversationId) => api.put(`/messages/${conversationId}/read`),
  },

  // Admin endpoints
  admin: {
    getUsers: (params) => api.get('/admin/users', { params }),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getAnalytics: (params) => api.get('/admin/analytics', { params }),
    getReports: (params) => api.get('/admin/reports', { params }),
    getSystemSettings: () => api.get('/admin/settings'),
    updateSystemSettings: (settings) => api.put('/admin/settings', settings),
  },

  // Support endpoints
  support: {
    getTickets: (params) => api.get('/support/tickets', { params }),
    getTicket: (id) => api.get(`/support/tickets/${id}`),
    createTicket: (ticket) => api.post('/support/tickets', ticket),
    updateTicket: (id, data) => api.put(`/support/tickets/${id}`, data),
    closeTicket: (id) => api.put(`/support/tickets/${id}/close`),
  },
};

export default api;
