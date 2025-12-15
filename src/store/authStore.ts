import api from '@/lib/api';
import { User } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/login', { email, password });
          const { user, access_token, refresh_token } = response.data.data;
          
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          const message = error.response?.data?.error?.message || 'Login failed';
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      register: async (email, password, displayName) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post('/auth/register', {
            email,
            password,
            display_name: displayName,
          });
          const { user, access_token, refresh_token } = response.data.data;
          
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          const message = error.response?.data?.error?.message || 'Registration failed';
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      logout: () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          api.post('/auth/logout', { refresh_token: refreshToken }).catch(() => {});
        }
        
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        set({ user: null, isAuthenticated: false, isLoading: false, error: null });
      },

      checkAuth: async () => {
        try {
          const token = localStorage.getItem('access_token');
          if (!token) {
            set({ 
              user: null, 
              isAuthenticated: false, 
              isLoading: false 
            });
            return;
          }

          const response = await api.get('/auth/me');
          set({ 
            user: response.data.data, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          // If token is invalid or expired, clear everything
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },

      setUser: (user) => set({ user }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

