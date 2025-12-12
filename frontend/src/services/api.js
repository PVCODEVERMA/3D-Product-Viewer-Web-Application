import axios from 'axios';

// Default backend URL (update this with your actual backend URL)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for large file uploads
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    
    throw new Error(error.message || 'An error occurred');
  }
);

// API Service functions
export const apiService = {
  // Upload 3D model
  async uploadModel(file) {
    const formData = new FormData();
    formData.append('model', file);
    formData.append('name', file.name.replace(/\.[^/.]+$/, ""));
    
    const response = await api.post('/models/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
          // You can emit this to a progress bar component
        }
      },
    });
    
    return response.data;
  },

  // Save viewer settings
  async saveViewerSettings(settings) {
    const response = await api.post('/settings', settings);
    return response.data;
  },

  // Get viewer settings
  async getViewerSettings() {
    try {
      const response = await api.get('/settings/latest');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      return null;
    }
  },

  // Get all models
  async getModels() {
    try {
      const response = await api.get('/models');
      return response.data;
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  },

  // Get single model
  async getModel(id) {
    const response = await api.get(`/models/${id}`);
    return response.data;
  },

  // Delete model
  async deleteModel(id) {
    const response = await api.delete(`/models/${id}`);
    return response.data;
  },

  // Export settings as JSON
  async exportSettings() {
    const response = await api.get('/settings/export');
    return response.data;
  },

  // Import settings from JSON
  async importSettings(settings) {
    const response = await api.post('/settings/import', settings);
    return response.data;
  }
};

// Export the axios instance and service
export { api };
export default apiService;