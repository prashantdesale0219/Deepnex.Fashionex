// Cookie utility functions for managing authentication and user data

/**
 * Set a cookie with specified name, value, and options
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {Object} options - Cookie options (expires, path, secure, etc.)
 */
export const setCookie = (name, value, options = {}) => {
  if (typeof window === 'undefined') return; // Server-side check
  
  const defaults = {
    path: '/',
    expires: 7, // 7 days default
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };
  
  const cookieOptions = { ...defaults, ...options };
  
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  // Add path
  if (cookieOptions.path) {
    cookieString += `; path=${cookieOptions.path}`;
  }
  
  // Add expiration
  if (cookieOptions.expires) {
    const date = new Date();
    date.setTime(date.getTime() + (cookieOptions.expires * 24 * 60 * 60 * 1000));
    cookieString += `; expires=${date.toUTCString()}`;
  }
  
  // Add secure flag
  if (cookieOptions.secure) {
    cookieString += '; secure';
  }
  
  // Add sameSite
  if (cookieOptions.sameSite) {
    cookieString += `; samesite=${cookieOptions.sameSite}`;
  }
  
  // Add httpOnly flag (note: this won't work from client-side JS)
  if (cookieOptions.httpOnly) {
    cookieString += '; httponly';
  }
  
  document.cookie = cookieString;
};

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export const getCookie = (name) => {
  if (typeof window === 'undefined') return null; // Server-side check
  
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }
  return null;
};

/**
 * Remove a cookie by setting its expiration to the past
 * @param {string} name - Cookie name
 * @param {Object} options - Cookie options (path, domain)
 */
export const removeCookie = (name, options = {}) => {
  if (typeof window === 'undefined') return; // Server-side check
  
  const defaults = {
    path: '/'
  };
  
  const cookieOptions = { ...defaults, ...options };
  
  let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  
  if (cookieOptions.path) {
    cookieString += `; path=${cookieOptions.path}`;
  }
  
  if (cookieOptions.domain) {
    cookieString += `; domain=${cookieOptions.domain}`;
  }
  
  document.cookie = cookieString;
};

/**
 * Set authentication token in cookie
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  setCookie('auth_token', token, {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

/**
 * Get authentication token from cookie
 * @returns {string|null} - Token or null if not found
 */
export const getAuthToken = () => {
  return getCookie('auth_token');
};

/**
 * Remove authentication token
 */
export const removeAuthToken = () => {
  removeCookie('auth_token');
};

/**
 * Set user data in cookie
 * @param {Object} userData - User object
 */
export const setUserData = (userData) => {
  setCookie('user_data', JSON.stringify(userData), {
    expires: 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

/**
 * Get user data from cookie
 * @returns {Object|null} - User object or null if not found
 */
export const getUserData = () => {
  const userData = getCookie('user_data');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error('Error parsing user data from cookie:', error);
      return null;
    }
  }
  return null;
};

/**
 * Remove user data from cookie
 */
export const removeUserData = () => {
  removeCookie('user_data');
};

/**
 * Clear all authentication related cookies
 */
export const clearAuthCookies = () => {
  removeAuthToken();
  removeUserData();
};

/**
 * Check if user is authenticated by checking token existence
 * @returns {boolean} - True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};