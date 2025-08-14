'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * OptimizedVideo component that handles video loading errors gracefully
 * and provides fallback for aborted requests
 */
export default function OptimizedVideo({
  src,
  title,
  width = '100%',
  height = 'auto',
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  fallbackHeight = '300px',
  fallbackText = 'Video preview unavailable',
  ...props
}) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    // Reset state when src changes
    setError(false);
    setLoading(true);
  }, [src]);

  // Handle video load error
  const handleError = (e) => {
    console.error("Video error:", e);
    setError(true);
    setLoading(false);
  };

  // Handle video loaded
  const handleLoaded = () => {
    setLoading(false);
  };

  return (
    <div className={`relative ${className}`} style={{ width }}>
      {loading && (
        <div 
          className="absolute inset-0 bg-gray-100 animate-pulse rounded"
          style={{ height: fallbackHeight }}
        />
      )}
      
      {error ? (
        // Fallback for error state
        <div 
          className="flex items-center justify-center bg-gray-100 w-full rounded"
          style={{ height: fallbackHeight }}
        >
          <p className="text-gray-500">{fallbackText}</p>
        </div>
      ) : (
        // Actual video with error handling
        <video
          ref={videoRef}
          src={src}
          title={title}
          className={`w-full h-auto ${loading ? 'invisible' : 'visible'}`}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          controls={controls}
          preload="metadata"
          onError={handleError}
          onLoadedData={handleLoaded}
          {...props}
        />
      )}
    </div>
  );
}