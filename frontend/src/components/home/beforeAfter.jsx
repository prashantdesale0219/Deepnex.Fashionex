'use client';
import { useEffect, useState, useRef } from 'react';

const BeforeAfter = () => {
  const [position, setPosition] = useState(50);
  // Maximum slider position (95%)  
  const maxPosition = 95;
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  // Handle mouse/touch events for movement
  useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window === 'undefined') return;
    
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      updatePosition(e);
    };

    const handleTouchMove = (e) => {
      updatePositionTouch(e);
    };

    // These are kept for mobile devices where touch and hold might be needed
    const handleTouchStart = (e) => {
      updatePositionTouch(e);
    };
    
    const handleMouseEnter = (e) => {
      // Set initial position when mouse enters
      updatePosition(e);
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
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Cleanup
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-b from-white to-coffee-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16  py-8 rounded-xl ">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 tracking-tight">
            See <span className='text-coffee-light italic font-extrabold'>Fashion<span className="text-coffee-dark">X</span></span> In <span className="italic text-coffee">Action</span>
          </h2>
          <p className="text-coffee-dark text-sm sm:text-base md:text-lg max-w-2xl mx-auto">Move your mouse across the image to see the before and after transformation</p>
        </div>

        <div 
          ref={containerRef}
          className="relative w-full max-w-5xl mx-auto h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-xl cursor-none hover:cursor-ew-resize transition-all duration-300"
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
              boxShadow: '0 0 8px rgba(0, 0, 0, 0.7)'
            }}
          >
            {/* Slider Handle */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-coffee-light hover:scale-110 transition-all duration-300">
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-coffee" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 bg-coffee-dark text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-bold shadow-lg transform transition-transform duration-300 hover:scale-105">
            Before
          </div>
          <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 right-2 sm:right-3 md:right-4 bg-coffee-light text-white px-3 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm font-bold shadow-lg transform transition-transform duration-300 hover:scale-105">
            After
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;