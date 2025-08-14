'use client';

import { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * ErrorFallback component for dashboard pages
 * Provides a user-friendly error message with retry functionality
 */
export default function ErrorFallback({ error, resetErrorBoundary }) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Add a small delay to show loading state
    setTimeout(() => {
      resetErrorBoundary();
      setIsRetrying(false);
    }, 1000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100 w-full">
      <div className="flex flex-col items-center justify-center text-center py-8">
        <div className="bg-yellow-50 p-3 rounded-full mb-4">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Something went wrong
        </h3>
        
        <p className="text-gray-500 mb-6 max-w-md">
          We encountered an error while loading this section. Please try again or refresh the page.
        </p>
        
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRetrying ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Retrying...
            </>
          ) : (
            'Try Again'
          )}
        </button>
      </div>
    </div>
  );
}