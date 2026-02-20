import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
export const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  register: async (fullName, email, password) => {
    const response = await api.post('/auth/register', { fullName, email, password });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Resume Service
export const resumeService = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('resume', file);
    const response = await api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  create: async (resumeData) => {
    const response = await api.post('/resume/create', resumeData);
    return response.data;
  },

  getList: async () => {
    const response = await api.get('/resume/list');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/resume/${id}`);
    return response.data;
  },

  download: async (id, isDownload = false) => {
    const url = isDownload 
      ? `/resume/download/${id}?download=true`
      : `/resume/download/${id}`;
    
    const response = await api.get(url, {
      responseType: 'blob'
    });
    return response;
  },

  delete: async (id) => {
    const response = await api.delete(`/resume/${id}`);
    return response.data;
  }
};

// Analysis Service
export const analysisService = {
  analyze: async (resumeId, jobDescription = '') => {
    const response = await api.post(`/analysis/${resumeId}`, { jobDescription });
    return response.data;
  },

  getHistory: async (resumeId) => {
    const response = await api.get(`/analysis/history/${resumeId}`);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/analysis/dashboard/stats');
    return response.data;
  }
};

// Cover Letter Service
export const coverLetterService = {
  generate: async (jobTitle, companyName, hiringManager, jobDescription, tone, resumeId) => {
    const response = await api.post('/cover-letter/generate', {
      jobTitle,
      companyName,
      hiringManager,
      jobDescription,
      tone,
      resumeId
    });
    return response.data;
  },

  getList: async () => {
    const response = await api.get('/cover-letter/list');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/cover-letter/${id}`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/cover-letter/${id}`);
    return response.data;
  }
};

// User Service
export const userService = {
  updateProfile: async (fullName, phone, location) => {
    const response = await api.put('/user/profile', { fullName, phone, location });
    return response.data;
  },

  updatePreferences: async (preferences) => {
    const response = await api.put('/user/preferences', preferences);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/user/password', { currentPassword, newPassword });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/user/stats');
    return response.data;
  }
};

export default api;
