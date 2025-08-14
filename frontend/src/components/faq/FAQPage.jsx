'use client';
import React, { useState, useEffect, useRef } from 'react';
import FAQSidebar from './FAQSidebar';
import GeneralFAQs from './GeneralFAQs';
import ProductFAQs from './ProductFAQs';
import PricingFAQs from './PricingFAQs';
import { FiMenu } from 'react-icons/fi';

const FAQPage = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const generalRef = useRef(null);
  const productRef = useRef(null);
  const pricingRef = useRef(null);
  
  // Handle scroll to section when sidebar link is clicked
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false); // Close mobile menu when a section is selected
    
    const sectionRefs = {
      general: generalRef,
      product: productRef,
      pricing: pricingRef
    };
    
    const ref = sectionRefs[sectionId];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Update active section based on scroll position using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Extract section id from the element id
            const sectionId = entry.target.id;
            setActiveSection(sectionId);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' } // Adjust rootMargin to control when sections are considered in view
    );

    // Observe all section refs
    if (generalRef.current) observer.observe(generalRef.current);
    if (productRef.current) observer.observe(productRef.current);
    if (pricingRef.current) observer.observe(pricingRef.current);

    return () => {
      // Cleanup observer
      if (generalRef.current) observer.unobserve(generalRef.current);
      if (productRef.current) observer.unobserve(productRef.current);
      if (pricingRef.current) observer.unobserve(pricingRef.current);
    };
  }, []);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <div className="bg-white min-h-screen">
      {/* FAQ Header */}
      <div className="bg-coffee text-white py-16 sm:py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center">Frequently Asked Questions</h1>
          <p className="text-center mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg text-gray-300">Find answers to common questions about our products and services</p>
        </div>
      </div>
      
      {/* Mobile menu toggle - only visible on mobile */}
      <div className="md:hidden sticky top-0 bg-white z-50 border-b p-3 sm:p-4">
        <button 
          onClick={toggleMobileMenu}
          className="flex items-center text-gray-700 focus:outline-none w-full justify-between"
        >
          <div className="flex items-center">
            <FiMenu className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
            <span className="text-sm sm:text-base">FAQ Sections</span>
          </div>
          <span className="text-xs text-gray-500">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</span>
        </button>
        
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-md border-b z-50">
            <FAQSidebar activeSection={activeSection} onSectionClick={scrollToSection} />
          </div>
        )}
      </div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 relative">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 relative">
          {/* Sidebar - Fixed on desktop, sticky after hero section */}
          <div className="md:w-1/4 lg:w-1/5">
            <div style={{ position: 'sticky', top: '8px', height: 'fit-content' }}>
              <FAQSidebar activeSection={activeSection} onSectionClick={scrollToSection} />
            </div>
          </div>

          
          {/* FAQ Content */}
          <div className="w-full md:w-3/4 lg:w-4/5 pb-4 sm:pb-6 lg:pb-8 md:pl-2 lg:pl-4">

            <div ref={generalRef} id="general" className="mb-8 sm:mb-12 lg:mb-16 scroll-mt-24">
              <GeneralFAQs />
            </div>
            
            <div ref={productRef} id="product" className="mb-8 sm:mb-12 lg:mb-16 scroll-mt-24">
              <ProductFAQs />
            </div>
            
            <div ref={pricingRef} id="pricing" className="mb-8 sm:mb-12 lg:mb-16 scroll-mt-24">
              <PricingFAQs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;