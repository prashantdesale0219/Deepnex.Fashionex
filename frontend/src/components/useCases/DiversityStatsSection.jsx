'use client';
import React, { useEffect, useState, useRef } from 'react';

const DiversityStatsSection = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      // Check if component is in viewport
      const statsElement = sectionRef.current;
      if (statsElement) {
        const rect = statsElement.getBoundingClientRect();
        const visibilityRatio = 1 - (Math.max(0, rect.top) / window.innerHeight);
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        setVisible(isVisible);

        // Check scroll position for width adjustment
        setScrolled(visibilityRatio > 0.5);
        
        // Apply width changes directly to the element for smoother transition
        // Start with smaller width and expand to full width when scrolled
        const initialWidth = 85; // Initial width when not scrolled (smaller)
        const finalWidth = 95; // Final width when fully scrolled (full width)
        
        // Calculate width based on visibility ratio
        const smoothProgress = Math.pow(visibilityRatio, 2); // Makes transition more gradual
        const width = initialWidth + ((finalWidth - initialWidth) * smoothProgress);
        
        statsElement.style.width = `${width}%`;
        statsElement.style.margin = '0 auto';
        statsElement.style.transition = 'width 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
        statsElement.style.willChange = 'width, opacity, transform'; // Optimize for animation performance
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
      ref={sectionRef}
      id="diversity-stats-section"
      className={`bg-coffee text-white transition-all duration-500 overflow-hidden ease-in-out rounded-xl md:rounded-3xl ${visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}
    >
      <div 
        className={`mx-auto py-8 sm:py-12 md:py-16 lg:py-24 transition-all duration-500 ${scrolled ? 'px-4 sm:px-6 lg:px-8' : 'px-5 sm:px-7 lg:px-10'} max-w-7xl`}
      >
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-vanilla mb-2 sm:mb-3 md:mb-4 px-2">
            Advantages creating<br className="hidden sm:inline" />diversity offers
          </h2>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* 10% Sales Card */}
          <div className="w-full">
            <div className="border border-vanilla rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 h-full flex flex-col items-center justify-center text-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-vanilla mb-1 sm:mb-2">10%</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-300">Sales</p>
            </div>
          </div>
          
          {/* 3x More options Card */}
          <div className="w-full">
            <div className="border border-vanilla rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 h-full flex flex-col items-center justify-center text-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-vanilla mb-1 sm:mb-2">3x</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-300">More options than<br className="hidden md:inline" />standard shoots</p>
            </div>
          </div>
          
          {/* 50% Time to market Card */}
          <div className="w-full">
            <div className="border border-vanilla rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 h-full flex flex-col items-center justify-center text-center">
              <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-vanilla mb-1 sm:mb-2">50%</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-300">Time to market</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiversityStatsSection;