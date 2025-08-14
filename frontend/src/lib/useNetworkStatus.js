'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to monitor network status and handle network-related errors
 * Helps reduce net::ERR_ABORTED errors by providing network status information
 */
export default function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [slowConnection, setSlowConnection] = useState(false);
  const [connectionType, setConnectionType] = useState('');

  useEffect(() => {
    // Update online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Check connection quality
    const checkConnectionQuality = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        
        if (connection) {
          // Set connection type
          setConnectionType(connection.effectiveType || '');
          
          // Check if connection is slow
          setSlowConnection(
            connection.effectiveType === 'slow-2g' || 
            connection.effectiveType === '2g' ||
            connection.downlink < 0.5
          );
          
          // Listen for connection changes
          const handleConnectionChange = () => {
            setConnectionType(connection.effectiveType || '');
            setSlowConnection(
              connection.effectiveType === 'slow-2g' || 
              connection.effectiveType === '2g' ||
              connection.downlink < 0.5
            );
          };
          
          connection.addEventListener('change', handleConnectionChange);
          return () => connection.removeEventListener('change', handleConnectionChange);
        }
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check
    setIsOnline(navigator.onLine);
    const cleanup = checkConnectionQuality();

    // Clean up event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (cleanup) cleanup();
    };
  }, []);

  return { isOnline, slowConnection, connectionType };
}