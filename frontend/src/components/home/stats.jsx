'use client';
import { useEffect, useState } from 'react';
import { statsData } from '@/data/home';

const Stats = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if component is in viewport
      const statsElement = document.getElementById('stats-section');
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
        const finalWidth = 90; // Final width when fully scrolled (full width)
        
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
      id="stats-section"
      className={`bg-coffee text-white transition-all duration-500 overflow-hidden ease-in-out rounded-xl sm:rounded-2xl md:rounded-3xl mx-4 sm:mx-6 md:mx-8 lg:mx-16 ${visible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}
    >
      <div 
        className={`mx-auto py-8 sm:py-12 md:py-16 lg:py-24 transition-all duration-500 ${scrolled ? 'px-4 sm:px-6 md:px-8 lg:px-16' : 'px-4 sm:px-6 md:px-12 lg:px-24'} max-w-7xl`}
      >
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-medium mb-6 sm:mb-10 md:mb-16 px-2">
           With <span className="italic text-vanilla">FashionX's</span> AI fashion models, our customers achieve
          </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8 text-center">
          {statsData.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-1 sm:mb-2 text-vanilla">{stat.value}</div>

              <div className="text-xs sm:text-sm md:text-base text-almond">{stat.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;