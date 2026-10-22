import axios, { AxiosInstance } from 'axios';
import { STORAGE_KEYS } from '@/constants/storageKeys';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear storage and redirect to login if unauthorized
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      const currentPath = window.location.pathname;
      let loginPath = '/login';

      if (currentPath.startsWith('/merchant')) {
        loginPath = '/merchant/login';
      } else if (currentPath.startsWith('/driver')) {
        loginPath = '/driver/login';
      } else if (currentPath.startsWith('/admin')) {
        loginPath = '/admin/login';
      }

      if (currentPath !== loginPath) {
        window.location.href = loginPath;
      }
    }
    return Promise.reject(error);
  }
);
