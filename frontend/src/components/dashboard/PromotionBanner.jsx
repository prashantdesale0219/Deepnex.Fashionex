import React from 'react';
import Link from 'next/link';

const PromotionBanner = () => {
  return (
    <div className="bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg p-2 sm:p-3 md:p-4 my-3 sm:my-4 md:my-6">
      <div className="flex flex-col xs:flex-row items-center">
        <div className="flex-1 mb-2 xs:mb-0">
          <div className="flex items-center justify-center xs:justify-start">
            <span className="text-amber-500 mr-1 sm:mr-2">✨</span>
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 text-center xs:text-left">Turn Flat Clothes into Fashion Reels! Zero Shoots Needed, 10X Sales Potential!</h3>
          </div>
        </div>
        <Link 
          href="/learn-more" 
          className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap px-2 sm:px-3 py-1 border border-blue-600 rounded-md"
        >
          Use Now
        </Link>
      </div>
    </div>
  );
};

export default PromotionBanner;