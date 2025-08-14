'use client';
import React from 'react';
import Image from 'next/image';

const DiversityFeatureSection = () => {
  return (
    <div className="w-full py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Left side - Text content */}
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 text-center md:text-left">Diverse models for every audience</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 text-center md:text-left">
              Connect with your entire customer base by showcasing your products on models that represent your diverse audience. 
              Easily create inclusive marketing materials that resonate with everyone.
            </p>
            
            {/* Numbered list */}
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black text-white font-medium mr-3 sm:mr-4">
                  1
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1 sm:mb-2">Increase representation</h3>
                  <p className="text-sm sm:text-base text-gray-600">Show your products on models of all ethnicities, ages, and body types.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black text-white font-medium mr-3 sm:mr-4">
                  2
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1 sm:mb-2">Expand your reach</h3>
                  <p className="text-sm sm:text-base text-gray-600">Connect with new customer segments by showing how your products look on them.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black text-white font-medium mr-3 sm:mr-4">
                  3
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-1 sm:mb-2">Build brand loyalty</h3>
                  <p className="text-sm sm:text-base text-gray-600">Create an emotional connection with customers who feel seen and represented.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="w-full md:w-1/2 mt-6 md:mt-0 order-1 md:order-2 mb-8 md:mb-0">
            <div className="relative rounded-xl overflow-hidden">
              <Image 
                src="/assets/images/useCaseAvatar1.avif" 
                alt="Diverse models showcase" 
                width={600} 
                height={700}
                className="w-full h-auto"
              />
              
              {/* Created with Botika watermark */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                Created with Botika ✨
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiversityFeatureSection;