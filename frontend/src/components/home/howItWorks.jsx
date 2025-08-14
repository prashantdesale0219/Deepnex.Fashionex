'use client';
import Link from 'next/link';
import { howItWorksSteps } from '@/data/home';
import { useEffect, useState } from 'react';

const HowItWorks = () => {
  // Responsive states
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4 tracking-tight">
            How <span className="text-vanilla italic">FashionX</span> works
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base md:text-lg px-2">
            No creative skills required - just a few clicks and you've got realistic stunning photos.
            Experience the magic of FashionX's AI-powered fashion photography today.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mb-8 sm:mb-12 md:mb-16 lg:mb-20 mx-1 sm:mx-4 md:mx-8 lg:mx-20">
          {howItWorksSteps.map((step) => (
            <div key={step.id} className="flex flex-col items-start lg:items-center p-3 sm:p-4 md:p-5">
              <div className="mb-1">
                <span className="text-base sm:text-lg md:text-xl font-bold text-coffee px-1 sm:px-2 rounded">{step.id}. {step.title}</span>
              </div>
              <p className="text-black text-center text-xs sm:text-sm md:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* App Video */}
        <div className="rounded-lg overflow-hidden shadow-lg sm:shadow-xl md:shadow-2xl border border-gray-200 mx-0 sm:mx-2 md:mx-4">
          <video 
            src="/assets/images/videos.mp4" 
            title="FashionX App Interface"
            width="1200"
            height="675"
            className="w-full h-auto"
            autoPlay
            loop
            muted
            playsInline
            onError={(e) => console.error("Video error:", e)}
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 md:gap-5 mt-6 sm:mt-8 md:mt-10 lg:mt-14">
          <Link
            href="/try-now"
            className="bg-coffee hover:bg-vanilla text-white hover:text-black px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-md font-medium text-center transition-colors duration-300 text-xs sm:text-sm md:text-base min-w-[100px] sm:min-w-[120px] md:min-w-[140px]"
          >
            Try Now
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center bg-white border border-gray-300 hover:border-gray-400 text-black px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-md font-medium text-center transition-colors duration-300 text-xs sm:text-sm md:text-base"
          >
            Available on Shopify App Store
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;