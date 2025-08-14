'use client';
import { useEffect, useState, useRef } from 'react';

const BeforeAfter = () => {
  const [position, setPosition] = useState(50);
  // Maximum slider position (95%)  
  const maxPosition = 95;
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  // Handle mouse/touch events for dragging
  useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window === 'undefined') return;
    
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e) => {
      setIsDragging(true);
      updatePosition(e);
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        updatePosition(e);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchStart = (e) => {
      setIsDragging(true);
      updatePositionTouch(e);
    };

    const handleTouchMove = (e) => {
      if (isDragging) {
        updatePositionTouch(e);
      }
    };

    const updatePosition = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const containerWidth = rect.width;
      // Invert the position calculation for right-to-left reveal
      const newPosition = Math.max(0, Math.min(maxPosition, 100 - (x / containerWidth) * 100));
      setPosition(newPosition);
    };

    const updatePositionTouch = (e) => {
      if (e.touches && e.touches[0]) {
        const rect = container.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const containerWidth = rect.width;
        // Invert the position calculation for right-to-left reveal
        const newPosition = Math.max(0, Math.min(maxPosition, 100 - (x / containerWidth) * 100));
        setPosition(newPosition);
      }
    };

    // Add event listeners
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleMouseUp);

    // Cleanup
    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 tracking-tight">
            See <span className='text-almond italic'>FashionX</span> In <span className="italic">Action</span>
          </h2>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full max-w-5xl mx-auto h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-xl cursor-ew-resize"
          style={{ touchAction: 'none' }}
        >
          {/* Before Image (Left side) */}
          <div className="absolute inset-0 w-full h-full">
            <img 
              src="/assets/images/beforeGenerate.avif" 
              alt="Before" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* After Image (Right side, revealed based on slider position) */}
          <div 
            className="absolute inset-0 h-full w-full overflow-hidden" 
          >
            <div 
              className="absolute inset-0 w-full h-full"
              style={{ 
                clipPath: `inset(0 0 0 ${100-position}%)`,
                WebkitClipPath: `inset(0 0 0 ${100-position}%)`
              }}
            >
              <img 
                src="/assets/images/afterGenerate.avif" 
                alt="After" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Slider Line */}
          <div 
            ref={sliderRef}
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
            style={{ 
              left: `${100-position}%`, 
              transform: 'translateX(-50%)',
              boxShadow: '0 0 5px rgba(0, 0, 0, 0.5)'
            }}
          >
            {/* Slider Handle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-md">
              <div className="flex flex-col items-center justify-center">
                <div className="w-0.5 sm:w-1 h-2 sm:h-2.5 md:h-3 bg-gray-400 rounded-full mb-0.5 sm:mb-1"></div>
                <div className="w-0.5 sm:w-1 h-2 sm:h-2.5 md:h-3 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 bg-black/70 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium">
            Before
          </div>
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 right-2 sm:right-3 md:right-4 bg-black/70 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium">
            After
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;