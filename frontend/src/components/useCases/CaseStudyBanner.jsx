'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CaseStudyBanner = () => {
  return (
    <div className="w-full max-w-6xl mx-auto my-12 sm:my-16 md:my-20 rounded-2xl py-10 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/assets/images/case-study-banner.webp" 
          alt="Case study background" 
          fill
          className="object-cover"
        />
        {/* Left side gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center">
          {/* Left side content */}
          <div>
            <div className="mb-2 sm:mb-3 md:mb-4">
              <span className="text-gray-300 text-xs sm:text-sm uppercase tracking-wider">case study</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-5 md:mb-6 leading-tight">
              JUAN & ME scales content with Botika's AI—and sees 128% more conversions
            </h2>
            
            <Link 
              href="/case-studies/juan-and-me" 
              className="inline-block bg-transparent border border-white text-white px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full hover:bg-white hover:text-black transition-colors text-sm sm:text-base"
            >
              Read More
            </Link>
          </div>
          
          {/* Right side is empty to allow the background image to show */}
          <div className="hidden md:block">
            {/* This space is intentionally left empty to show the model in the background */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudyBanner;