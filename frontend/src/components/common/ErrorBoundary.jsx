'use client';

import { useState, useEffect } from 'react';

/**
 * ErrorBoundary component to handle and gracefully recover from errors
 * Particularly useful for handling image loading errors
 */
export default function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);

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
        console.error('Unhandled promise rejection:', event.reason);
        setHasError(true);
      } else {
        // Handle undefined reasons gracefully
        console.warn('Undefined promise rejection caught by ErrorBoundary');
        // Don't set hasError to true for undefined rejections
        // as they're usually non-critical
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
        console.error('Error caught by ErrorBoundary:', event.error);
        setHasError(true);
      } else {
        // Handle undefined errors gracefully
        console.warn('Undefined error caught by ErrorBoundary');
        // Don't set hasError to true for undefined errors
        // as they're usually non-critical
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

  // Add a custom image error handler
  useEffect(() => {
    const handleImageErrors = () => {
      // Find all images on the page
      const images = document.querySelectorAll('img');
      
      // Add error handler to each image
      images.forEach(img => {
        if (!img.hasAttribute('data-error-handled')) {
          img.setAttribute('data-error-handled', 'true');
          img.addEventListener('error', (e) => {
            // Prevent the error from bubbling up
            e.stopPropagation();
            
            // Apply a fallback style or image
            img.style.display = 'none';
            // Alternatively, set a placeholder image
            // img.src = '/placeholder.png';
          });
        }
      });
    };

    // Run once on mount
    handleImageErrors();

    // Set up a MutationObserver to handle dynamically added images
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length) {
          handleImageErrors();
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  if (hasError) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800">Something went wrong. Please try refreshing the page.</p>
      </div>
    );
  }

  return children;
}