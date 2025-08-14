'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { homeSlider } from '@/data/home';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroSlider = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Add custom CSS for smoother transitions and performance optimization
  // Use throttling for scroll event to improve performance
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };
  
  // Handle responsive layout changes
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768); // Mobile breakpoint
    setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024); // Tablet breakpoint
  }, []);

  useEffect(() => {
    // Initial check for device type
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollThreshold = 50;
      
      // Calculate progress between 0 and 1 based on scroll position with debouncing for smoother effect
      const progress = Math.min(1, Math.max(0, scrollY / scrollThreshold));
      
      // Only update state if there's a significant change
      if ((scrollY > scrollThreshold && !scrolled) || (scrollY <= scrollThreshold && scrolled)) {
        setScrolled(scrollY > scrollThreshold);
      }
      
      // Apply smooth transition directly to the Swiper container
      const swiperContainer = document.querySelector('.swiper');
      if (swiperContainer) {
        // Calculate width based on scroll progress - minimal width reduction for larger banner
        const maxWidthReduction = isMobile ? 5 : 10; // Less reduction on mobile for better visibility
        
        // Use a slower, smoother progress calculation to eliminate lag
        const smoothProgress = Math.pow(progress, 2); // Makes the transition even more gradual
        const width = 100 - (smoothProgress * maxWidthReduction * (scrollY > scrollThreshold ? 1 : 0));
        
        // Ensure width is never less than 95% (or 98% on mobile)
        const finalWidth = Math.max(isMobile ? 98 : 95, width);
        swiperContainer.style.width = `${finalWidth}%`;
        swiperContainer.style.margin = '0 auto'; // Always centered
        swiperContainer.style.borderRadius = scrollY > scrollThreshold ? '0 0 1.5rem 1.5rem' : '0';
        
        // Add ultra-smooth transition to the swiper container
        swiperContainer.style.transition = 'width 0.8s cubic-bezier(0.25, 0.1, 0.25, 1), border-radius 1s ease-in-out';
        swiperContainer.style.willChange = 'width, border-radius'; // Optimize for animation performance
        
        // Also update all slide backgrounds to match the border radius with smoother transition
        const slideBackgrounds = document.querySelectorAll('.swiper-slide > div:nth-child(2)');
        slideBackgrounds.forEach(bg => {
          bg.style.borderRadius = scrollY > scrollThreshold ? '0 0 1.5rem 1.5rem' : '0';
          bg.style.transition = 'border-radius 0.2s ease-in-out';
          bg.style.willChange = 'border-radius'; // Optimize for animation performance
        });
        
        // Update slide content for ultra-smooth appearance
        const slideContents = document.querySelectorAll('.swiper-slide .absolute.inset-0.flex');
        slideContents.forEach(content => {
          content.style.transition = 'opacity 0s ease-in-out, transform 0.2s ease-out';
          content.style.transform = scrollY > scrollThreshold ? 'translateY(0)' : 'translateY(0)';
          content.style.willChange = 'opacity, transform'; // Optimize for animation performance
        });
      }
    };

    // Throttle scroll event to run at most once every 16ms (60fps)
    const throttledHandleScroll = throttle(handleScroll, 16);
    
    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    // Call once to set initial state
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [scrolled, isMobile]);

  return (
    <div className="relative w-full h-[90vh] sm:h-[100vh] md:h-screen overflow-hidden overflow-x-hidden">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-full transition-all duration-1200 ease-in-out overflow-hidden overflow-x-hidden"
      >
        {homeSlider.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            <div className="absolute inset-0 bg-black/30 z-10" />
            <div 
              className="relative w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
              style={{
                backgroundImage: `url(${isMobile || isTablet ? slide.mobImage : slide.image})`,
                backgroundPosition: isMobile ? 'center 30%' : 'center center'
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center md:justify-start z-20 px-4 sm:px-6 md:px-12 lg:px-16">
                <div className={`${isMobile ? 'max-w-full text-center' : isTablet ? 'max-w-full text-center' : 'max-w-3xl text-left'} text-white`}>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-5">
                    {slide.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 md:mb-10 max-w-full md:max-w-2xl">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center md:justify-start">
                    <Link
                      href="/try-now"
                      className="bg-white hover:bg-almond text-coffee px-4 sm:px-5 md:px-7 py-2.5 sm:py-3 md:py-4 rounded-md font-medium text-center transition-colors duration-300 text-xs sm:text-sm md:text-base"
                    >
                      Try Now
                    </Link>
                    <Link
                      href="/"
                      className="border border-white hover:bg-white hover:text-black text-white px-4 sm:px-5 md:px-7 py-2.5 sm:py-3 md:py-4 rounded-md font-medium text-center transition-colors duration-300 text-xs sm:text-sm md:text-base"
                    >
                      Available on Shopify App Store
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSlider;