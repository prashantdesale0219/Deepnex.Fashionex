'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const DiversityHeroSection = () => {
  return (
    <div className="w-full bg-white py-20 sm:py-16 md:py-24 bg-coffee">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading and description */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">Increase diversity</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2 sm:px-0">
            Create the perfect scene with diverse AI models and settings. Easily switch up
            models and moods to connect with a wider audience.
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-10 sm:mb-16">
          <Link href="/try-now" className="w-full sm:w-auto bg-black text-white px-6 sm:px-8 py-3 rounded-md hover:bg-gray-800 transition-colors text-center">
            Try Now
          </Link>
          <Link href="https://apps.shopify.com/botika" className="w-full sm:w-auto flex items-center justify-center bg-white border border-gray-300 px-4 sm:px-6 py-3 rounded-md hover:bg-gray-50 transition-colors text-center">
            <span className="mr-2">Available on</span>
            <span className="font-medium">Shopify App Store</span>
          </Link>
        </div>
        
        {/* Image grid */}
        <div className="relative w-full rounded-xl overflow-hidden bg-black p-3 sm:p-4 md:p-6 lg:p-8">
            {/* Center column - large image */}
            <div className="rounded-md overflow-hidden">
              <Image 
                src="/assets/images/useCase1.webp" 
                alt="Main model" 
                width={600} 
                height={900} 
                className="w-full h-full object-cover"
                priority
              />
            </div>

          
          {/* Created with Botika watermark */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
            Created with Botika ✨
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiversityHeroSection;