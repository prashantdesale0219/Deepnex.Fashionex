'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gridsData } from '@/data/home';

const Grids = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      // Check if component is in viewport
      const gridsElement = document.getElementById('grids-section');
      if (gridsElement) {
        const rect = gridsElement.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        setVisible(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      id="grids-section"
      className={`py-10 sm:py-12 md:py-16 lg:py-24 transition-all duration-500 ${visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        {gridsData.map((grid) => (
          <div 
            key={grid.id} 
            className={`flex flex-col ${grid.layout === 'image-left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-4 sm:gap-6 md:gap-8 lg:gap-16 mb-12 sm:mb-16 md:mb-20 lg:mb-24 last:mb-0`}
          >
            {/* Image/Video Section */}
            <div className="w-full md:w-1/2">
              {grid.image.endsWith('.webm') ? (
                <video 
                  src={grid.image}
                  className="w-full h-auto rounded-lg shadow-lg"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onError={(e) => {
                    console.error("Video error:", e);
                    // Hide the video element on error
                    e.target.style.display = 'none';
                    // Show a fallback image or message
                    const parent = e.target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'flex items-center justify-center bg-gray-100 w-full h-[200px] rounded-lg';
                      fallback.innerHTML = '<p class="text-gray-500">Video preview unavailable</p>';
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src={grid.image} 
                    alt={grid.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            {/* Content Section */}
            <div className="w-full md:w-1/2 mt-4 sm:mt-5 md:mt-0">
              <div className="text-xs uppercase tracking-wider text-coffee font-semibold mb-1 sm:mb-2">
                SAVE TIME & MONEY
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">
                {grid.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 md:mb-6">
                {grid.description}
              </p>
              <Link 
                href="/" 
                className="text-coffee hover:text-vanilla underline font-medium text-sm sm:text-base"
              >
                Learn more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Grids;