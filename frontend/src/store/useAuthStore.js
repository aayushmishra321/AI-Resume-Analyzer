import { create } from 'zustand';
import { authService } from '../services/api';

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await authService.login(email, password);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        loading: false
      });
      
      return response;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Login failed' 
      });
      throw error;
    }
  },

  register: async (fullName, email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await authService.register(fullName, email, password);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      set({
        user: response.data.user,
        token: response.data.token,
        isAuthenticated: true,
        loading: false
      });
      
      return response;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Registration failed' 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null
    });
  },

  clearError: () => set({ error: null })
}));
