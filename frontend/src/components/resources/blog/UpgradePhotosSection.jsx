'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const UpgradePhotosSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="bg-coffee text-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 lg:p-16 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Ready to upgrade your photos?</h2>
        <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-1 sm:mb-2">
          With Botika's app, you have our AI generated models for fashion right in your pocket.
        </p>
        <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-4 sm:mb-6 lg:mb-8">
          Snap, upload, and get stunning, realistic photos in minutes, all on your phone.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3 md:space-x-4 mt-6 sm:mt-8">
          <Link 
            href="#"
            className="bg-white text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-gray-100 transition-colors"
          >
            Try Now
          </Link>
          
          <Link 
            href="#"
            className="bg-white text-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            <Image 
              src="/assets/images/apple-logo.svg" 
              alt="Apple Logo" 
              width={16} 
              height={16}
              className="mr-1.5 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5"
            />
            <div>
              <div className="text-[10px] sm:text-xs text-left">Available on the</div>
              <div className="font-semibold text-left text-xs sm:text-sm">App Store</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpgradePhotosSection;