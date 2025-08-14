'use client';
import React from 'react';
import Image from 'next/image';

const TestimonialSection = () => {
  return (
    <div className="w-full py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Logo at the top */}
          <div className="mb-6 sm:mb-8">
            <Image 
              src="/assets/images/jordache-logo.webp" 
              alt="Jordache logo" 
              width={100} 
              height={33}
              className="h-auto w-24 sm:w-28 md:w-32"
            />
          </div>
          
          {/* Testimonial text */}
          <div className="max-w-3xl mx-auto mb-6 sm:mb-8 md:mb-10 px-2 sm:px-4 md:px-0">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 leading-relaxed">
              Using Botika's AI models has transformed our approach to
              fashion photography. We've cut costs and reduced our
              production time significantly, all while maintaining the high-
              quality standards our brand is known for.
            </p>
          </div>
          
          {/* Profile image and details */}
          <div className="flex flex-col items-center">
            <div className="mb-3 sm:mb-4">
              <Image 
                src="/assets/images/avatar.webp" 
                alt="Shaul Cohen" 
                width={56} 
                height={56}
                className="rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16"
              />
            </div>
            <h4 className="font-medium text-gray-900 text-base sm:text-lg">Shaul Cohen</h4>
            <p className="text-xs sm:text-sm text-gray-500">Executive Vice President, Jordache</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;