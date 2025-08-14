'use client';
import React from 'react';
import Image from 'next/image';

const BlogBanner = () => {
  return (
    <div className="max-w-7xl mx-auto my-10 sm:my-16 md:my-32  px-4 sm:px-6 lg:px-8">
      {/* Title and subtitle */}
      <div className="text-center mb-6 sm:mb-8 md:mb-12 py-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 md:mb-4">The Thread</h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl px-2">Discover new ways to elevate your brand with tips and trends from the fashion world</p>
      </div>
      
      {/* Featured post with background image */}
      <div className="relative overflow-hidden rounded-xl shadow-xl">
        {/* Fall Collection Banner */}
      
        
        <div className="relative h-[300px] sm:h-[400px] md:h-[500px] ">
          {/* Background Image */}
        <div className='relative h-full w-full'>
            <Image 
            src="/assets/images/blog-banner.webp" 
            alt="Blog Banner" 
            fill 
            className="object-cover"
            priority
          />
          <div className='absolute inset-0 bg-gradient-to-r from-black/80 to-black/0 w-full h-full'></div>
        </div>
          
          
          {/* eCommerce Tag */}
          <div className="absolute top-8 sm:top-12 md:top-20 left-4 text-white text-xs px-2 py-1 rounded">
            eCommerce
          </div>
          
          {/* ROAS Content */}
          <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 max-w-full sm:max-w-xl md:max-w-2xl">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight">How to increase ROAS for fashion eCommerce using better photos</h2>
            <p className="text-white text-xs sm:text-sm md:text-base mb-2 sm:mb-3 md:mb-4">By Avi Friedman | August 5, 2025</p>
            <button className="bg-white text-black text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1 sm:py-2 rounded-md hover:bg-gray-200 transition-colors">Read More</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogBanner;