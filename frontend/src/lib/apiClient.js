import axios from 'axios';

/**
 * Enhanced API client with error handling and retry mechanism
 * Helps reduce network-related errors and improves reliability
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
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

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Ignore aborted requests
    if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
      console.log('Request was aborted or timed out');
      return Promise.reject(error);
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      console.log('Network error detected, check your connection');
      return Promise.reject(error);
    }
    
    // Implement retry logic for server errors (5xx) and timeout errors
    if (
      (error.response && error.response.status >= 500) ||
      error.code === 'ECONNABORTED'
    ) {
      // Only retry once and if not already retried
      if (!originalRequest._retry && originalRequest.method === 'GET') {
        originalRequest._retry = true;
        
        // Wait 1 second before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return apiClient(originalRequest);
      }
    }
    
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if needed
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        
        // Dispatch custom event for components to react
        window.dispatchEvent(new CustomEvent('loginStatusChanged'));
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;