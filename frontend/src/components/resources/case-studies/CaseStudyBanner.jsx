'use client';
import React from 'react';
import Image from 'next/image';

const CaseStudyBanner = () => {
  return (
    <div className="max-w-7xl mx-auto my-10 sm:my-14 lg:my-20 px-4 sm:px-6 lg:px-8">
      {/* Title and subtitle */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 lg:mb-4">Case studies</h1>
        <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-2 sm:px-4 lg:px-0">
          See how our clients transformed their fashion brands with Botika. From cutting 
          production costs to speeding up time to market, these stories highlight the real 
          impact of our AI-generated fashion models.
        </p>
      </div>
    </div>
  );
};

export default CaseStudyBanner;