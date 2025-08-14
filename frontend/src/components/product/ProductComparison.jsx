'use client';
import React from 'react';
import Link from 'next/link';

const ProductComparison = () => {
  return (
    <>
    <section className="py-10 sm:py-14 md:py-20 bg-vanilla/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-5">
            Break free from
            <span className="block italic">traditional</span> photoshoots
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm sm:text-base md:text-lg px-2 leading-relaxed">
            Photoshoots can be a real hassle, from hiring models to finding locations.
            Learn how our AI generated fashion models streamline the process.
          </p>
        </div>
        
        {/* Comparison Cards - 3 Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto gap-0 md:shadow-lg rounded-lg overflow-hidden">
          {/* Left Column - Category Titles */}
          <div className="p-4 sm:p-5 md:p-6 flex flex-col justify-center bg-gray-50 md:bg-transparent">
            <div className="space-y-[35px] sm:space-y-[40px] md:space-y-[50px] mt-4 sm:mt-6 md:mt-8">
              <div className="flex items-center h-12 sm:h-14 md:h-16">
                <span className="font-semibold text-gray-800 text-left text-sm sm:text-base md:text-lg">Finding Models</span>
              </div>
              
              <div className="flex items-center h-16 sm:h-20 md:h-24">
                <span className="font-semibold text-gray-800 text-left text-sm sm:text-base md:text-lg">Shoot Logistics</span>
              </div>
              
              <div className="flex items-center h-16 sm:h-20 md:h-24">
                <span className="font-semibold text-gray-800 text-left text-sm sm:text-base md:text-lg">On-Set Prep</span>
              </div>
              
              <div className="flex items-center h-12 sm:h-14 md:h-16">
                <span className="font-semibold text-gray-800 text-left text-sm sm:text-base md:text-lg">Total Turnaround Time</span>
              </div>
              
              <div className="flex items-center h-12 sm:h-14 md:h-16">
                <span className="font-semibold text-gray-800 text-left text-sm sm:text-base md:text-lg">Pricing</span>
              </div>
            </div>
          </div>
          
          {/* Middle Column - Traditional Photoshoots */}
          <div className="bg-white p-4 sm:p-5 md:p-6 border-t border-b md:border-t-0 md:border-l md:border-r border-gray-200 md:shadow-sm">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-coffee text-center mb-4 sm:mb-6 md:mb-8">
              Traditional<br />Photoshoots
            </h3>
            
            <div className="space-y-[35px] sm:space-y-[40px] md:space-y-[50px] mt-4 sm:mt-6 md:mt-8">
              <div className="flex items-center h-12 sm:h-14 md:h-16">
                  <span className="text-gray-600 w-full text-center text-sm sm:text-base">Expensive and time<br />consuming</span>
                </div>
              
              <div className="flex items-start h-16 sm:h-20 md:h-24">
                <span className="text-gray-600 w-full text-center text-sm sm:text-base">
                  Production includes:<br />
                  - Location scouting<br />
                  - Securing permits<br />
                  - Transportation
                </span>
              </div>
              
              <div className="flex items-start h-16 sm:h-20 md:h-24">
                <span className="text-gray-600 w-full text-center text-sm sm:text-base">
                  Preparation includes:<br />
                  - Photographer<br />
                  - Lighting<br />
                  - Makeup artist
                </span>
              </div>
              
              <div className="flex items-center h-12 sm:h-14 md:h-16">
                <span className="text-gray-600 w-full text-center text-sm sm:text-base">5-10 weeks</span>
              </div>
              
              <div className="flex items-center h-12 sm:h-14 md:h-16">
                <div className="text-center w-full">
                  <p className="font-bold text-lg sm:text-xl md:text-2xl text-gray-800">$10K + per shoot</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - BOTIKA */}
          <div className="bg-white p-4 sm:p-5 md:p-6 border border-gray-200 md:border-t-0 md:border-l-0 relative overflow-hidden md:shadow-sm">
            {/* BOTIKA Logo */}
            <div className="flex justify-center items-center mb-2">
              <div className="bg-white rounded-full p-1 shadow-sm inline-flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-coffee">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              </div>
            </div>
            
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-coffee text-center mb-4 sm:mb-6 md:mb-8">
                BOTIKA
            </h3>
            
            <div className="space-y-[35px] sm:space-y-[40px] md:space-y-[50px] mt-4 sm:mt-6 md:mt-8">
              <div className="flex items-center justify-center h-12 sm:h-14 md:h-16">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-coffee mr-2 sm:mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-sm sm:text-base">Diverse AI-Model Portfolio</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center h-16 sm:h-20 md:h-24">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-coffee mr-2 sm:mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-sm sm:text-base">All taken care of by AI</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center h-16 sm:h-20 md:h-24">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-coffee mr-2 sm:mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-sm sm:text-base">Flawless photos with Botika's AI corrections and expert reviews</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center h-12 sm:h-14 md:h-16">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-coffee mr-2 sm:mr-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium text-sm sm:text-base">Same-day results</span>
                </div>
              </div>
              
              <div className="flex items-center h-12 sm:h-14 md:h-16 bg-coffee text-white rounded-md shadow-md">
                <div className="text-center w-full">
                  <p className="font-bold text-sm sm:text-base md:text-lg">Starting at $25/month</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="mt-12 sm:mt-16 md:mt-20 flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 max-w-2xl mx-auto px-4 sm:px-6">
          {/* Try Now Button */}
          <Link 
            href="/pricing" 
            className="bg-[#2D1A12] hover:bg-[#3D2A22] text-white font-bold py-4 px-10 rounded-md transition-all duration-300 w-full sm:w-auto text-center text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex-shrink-0"
          >
            Try Now
          </Link>
          
          {/* Shopify App Store Button */}
          <Link 
            href="https://apps.shopify.com/botika" 
            target="_blank" 
            className="bg-[#F5F5F7] border-2 border-gray-200 text-gray-800 hover:bg-gray-100 font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-md transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex-shrink-0"
          >
            <div className="flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3 text-[#2D1A12]">
                <path d="M13.3333 2.66667H2.66667C1.93029 2.66667 1.33333 3.26363 1.33333 4.00001V12C1.33333 12.7364 1.93029 13.3333 2.66667 13.3333H13.3333C14.0697 13.3333 14.6667 12.7364 14.6667 12V4.00001C14.6667 3.26363 14.0697 2.66667 13.3333 2.66667Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.33333 8.00001L7.33333 9.33334L10.6667 6.66667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="flex flex-col items-start">
                <span className="text-xs text-gray-600">Available on</span>
                <span className="font-bold text-sm sm:text-base">Shopify App Store</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>

    {/* Full Width Banner Image */}
    <section className="w-full overflow-hidden">
      <div className="relative">
        <img 
          src="/assets/images/productBanner2.avif" 
          alt="Product Banner" 
          className="w-full h-56 sm:h-72 md:h-96 lg:h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 pointer-events-none"></div>
      </div>
    </section>

    {/* Stats Section */}
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 shadow-xl">
        {/* Left Side - Easy Integration */}
        <div className="bg-vanilla py-10 sm:py-14 md:py-20 px-6 sm:px-8 md:px-12 flex flex-col items-center justify-center text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">Easy integration,</h2>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 italic mb-4 sm:mb-6 md:mb-8">stunning <span className="text-coffee">results</span></h2>
            
            <p className="text-gray-600 mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base md:text-lg leading-relaxed">
              Botika for Shopify lets you easily update fashion photos
              with AI models and backgrounds. Our Shopify app makes
              it simple to upgrade photos and batch edit your catalog
              right from your store.
            </p>
            
            <div className="inline-block border-2 border-gray-300 rounded-md px-4 sm:px-5 py-2 sm:py-3 hover:bg-gray-50 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
              <div className="flex items-center">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 text-coffee">
                  <path d="M13.3333 2.66667H2.66667C1.93029 2.66667 1.33333 3.26363 1.33333 4.00001V12C1.33333 12.7364 1.93029 13.3333 2.66667 13.3333H13.3333C14.0697 13.3333 14.6667 12.7364 14.6667 12V4.00001C14.6667 3.26363 14.0697 2.66667 13.3333 2.66667Z" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.33333 8.00001L7.33333 9.33334L10.6667 6.66667" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-sm sm:text-base">Available on</span>
              </div>
              <span className="block text-sm sm:text-base font-bold mt-1">Shopify App Store</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Stats */}
        <div className="bg-coffee py-10 sm:py-14 md:py-20 px-6 sm:px-8 md:px-12 text-white">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-2 sm:mb-3">The numbers to prove it</h3>
            <p className="text-sm sm:text-base mb-6 sm:mb-8 md:mb-10 leading-relaxed">
              Botika's AI fashion models tech isn't just fun—it's game changing
              for our customers' fashion businesses. Here's how:
            </p>
            
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-6 sm:mb-8 md:mb-10">
              <div className="bg-coffee/30 p-4 sm:p-5 rounded-lg hover:bg-coffee/40 transition-colors duration-300">
                <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">-90%</h4>
                <p className="text-sm sm:text-base mt-2">Visual production costs</p>
              </div>
              
              <div className="bg-coffee/30 p-4 sm:p-5 rounded-lg hover:bg-coffee/40 transition-colors duration-300">
                <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">10x</h4>
                <p className="text-sm sm:text-base mt-2">Faster time to market</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 sm:gap-8 md:gap-10 mb-6 sm:mb-8 md:mb-10">
              <div className="bg-coffee/30 p-4 sm:p-5 rounded-lg hover:bg-coffee/40 transition-colors duration-300">
                <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">+10%</h4>
                <p className="text-sm sm:text-base mt-2">In conversion rates</p>
              </div>
              
              <div className="bg-coffee/30 p-4 sm:p-5 rounded-lg hover:bg-coffee/40 transition-colors duration-300">
                <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">+12%</h4>
                <p className="text-sm sm:text-base mt-2">Average order value</p>
              </div>
            </div>
            
            <div className="bg-coffee/30 p-4 sm:p-5 rounded-lg hover:bg-coffee/40 transition-colors duration-300 max-w-xs mx-auto">
              <h4 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">+30%</h4>
              <p className="text-sm sm:text-base mt-2">In ad click-through rates</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default ProductComparison;