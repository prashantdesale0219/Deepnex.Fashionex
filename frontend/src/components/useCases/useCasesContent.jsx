'use client';
import React from 'react';
import RefreshImagesSection from './RefreshImagesSection';
import DiversityHeroSection from './DiversityHeroSection';
import TestimonialSection from './TestimonialSection';
import DiversityFeatureSection from './DiversityFeatureSection';
import DiversityStatsSection from './DiversityStatsSection';
import CaseStudyBanner from './CaseStudyBanner';
import ExploreMoreSection from './ExploreMoreSection';
import FAQ from '../home/faq';
// Import use cases data
import { useCasesData } from '@/data/use-cases';
// Removed sticky-scroll-reveal import that was causing errors

const UseCasesContent = () => {

  return (
    <>
      {/* Hero Section with Diversity Grid */}
      <DiversityHeroSection />
      
      <div className="w-full py-20 bg-white">
        <div className=" mx-auto px-4 sm:px-6 lg:px-0">
          <div className="text-center ">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Use Cases</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how FashionX can transform your visual content strategy with AI-generated fashion photography
            </p>
          </div>
        </div>
      </div>
      
      {/* Add the new Refresh Images section with content prop */}
      <RefreshImagesSection content={useCasesData} />
      
      {/* Add the Diversity Feature section */}
      <DiversityFeatureSection />
      
      {/* Add the Diversity Stats section */}
      <DiversityStatsSection />
      
      {/* Add the Case Study Banner section */}
      <CaseStudyBanner />
      
      {/* Add the Explore More section */}
      <ExploreMoreSection />
      
      {/* Add the Testimonial section */}
      <TestimonialSection />
      <FAQ/>
    </>
  );
};

export default UseCasesContent;