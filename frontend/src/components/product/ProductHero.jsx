'use client';
import React from 'react';
import Link from 'next/link';

const ProductHero = () => {
  return (
    <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32 bg-white mt-16 sm:mt-20 md:mt-24 lg:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
            <span>How </span>
            <span className="italic">our</span>
            <span> AI generated </span>
            <br className="hidden xs:block" />
            <span>fashion models work?</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-3 sm:mb-4 md:mb-5">
            Start with any product shot
          </p>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 md:mb-10">
            Our AI turns it into stunning on-model visuals with perfect detail.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 md:gap-6">
            <Link 
              href="#try-now" 
              className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-gray-900 text-white text-sm sm:text-base font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              Try Now
            </Link>
            
            <Link 
              href="https://apps.shopify.com" 
              className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm sm:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <span className="text-xs sm:text-sm md:text-base">Available on</span>
              <span className="font-medium text-xs sm:text-sm md:text-base">Shopify App Store</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductHero;