'use client';

import { useState, useEffect } from 'react';
import ErrorFallback from './ErrorFallback';

/**
 * DashboardErrorBoundary component specifically designed for dashboard pages
 * Uses ErrorFallback component to display user-friendly error messages
 */
export default function DashboardErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    // Handle unhandled promise rejections
    const handlePromiseRejection = (event) => {
      // Prevent console errors for aborted requests
      if (event.reason && event.reason.name === 'AbortError') {
        event.preventDefault();
        return;
      }

      // Check if reason exists before logging
      if (event.reason) {
        console.error('Dashboard unhandled promise rejection:', event.reason);
        setError(event.reason);
      } else {
        // Handle undefined reasons gracefully
        console.warn('Dashboard undefined promise rejection');
        // Don't set error for undefined rejections
      }
    };

    // Handle general errors
    const handleError = (event) => {
      // Prevent console errors for network aborted errors
      if (event.message && event.message.includes('net::ERR_ABORTED')) {
        event.preventDefault();
        return;
      }

      // Check if error exists before logging
      if (event.error) {
        console.error('Dashboard error caught:', event.error);
        setError(event.error);
      } else {
        // Handle undefined errors gracefully
        console.warn('Dashboard undefined error caught');
        // Don't set error for undefined errors
      }
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handlePromiseRejection);
    window.addEventListener('error', handleError, true);

    // Clean up event listeners
    return () => {
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  // Reset error state
  const resetErrorBoundary = () => {
    setError(null);
  };

  if (error) {
    return <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />;
  }

  return children;
}