import axios from 'axios';
import { getAuthToken, removeAuthToken } from './cookieUtils';

/**
 * Enhanced API client with error handling and retry mechanism
 * Helps reduce network-related errors and improves reliability
 */
const apiClient = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api',
  timeout: 10000, // 10 seconds - reduced timeout
  headers: {
    'Content-Type': 'application/json',
  },
  // Add retry configuration
  retry: 3,
  retryDelay: 1000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from cookies if available
    const token = getAuthToken();
    
    // Add token to headers if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors with retry logic
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        originalRequest._retryCount = originalRequest._retryCount || 0;
        
        if (originalRequest._retryCount < (originalRequest.retry || 2)) {
          originalRequest._retryCount++;
          
          // Wait before retrying
          await new Promise(resolve => 
            setTimeout(resolve, originalRequest.retryDelay || 1000)
          );
          
          console.log(`Retrying request (${originalRequest._retryCount}/${originalRequest.retry || 2})`);
          return apiClient(originalRequest);
        }
      }
    }
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if needed
      if (typeof window !== 'undefined') {
        removeAuthToken();
        
        // Dispatch custom event for components to react
        window.dispatchEvent(new CustomEvent('loginStatusChanged'));
      }
    }
    
    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.message,
        code: error.code
      });
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;