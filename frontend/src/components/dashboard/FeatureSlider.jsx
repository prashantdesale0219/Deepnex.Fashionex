'use client';
import React, { useState } from 'react';
import Image from 'next/image';

const FeatureSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  const slides = [
    {
      id: 1,
      title: 'Bye Bye Blurry Pics 👋👋',
      subtitle: 'Crisp & Clear 25x HD Enhancement Now Live!',
      ctaText: 'Try Now >',
      bgColor: 'from-blue-900 to-indigo-800',
      image: '/src/components/dashboard/slider1.webp'
    },
    {
      id: 2,
      title: 'COCREATE 2025',
      subtitle: 'FREE 2-NIGHT HOTEL WITH EARLY BIRD LIMITED OFFER',
      ctaText: 'Get Tickets!',
      bgColor: 'from-gray-900 to-gray-800',
      image: '/src/components/dashboard/slider2.webp'
    }
  ];

  const handleDotClick = (index) => {
    setActiveSlide(index);
  };

  return (
    <div className="relative w-full h-auto md:h-[180px] overflow-hidden rounded-xl shadow-md my-4 sm:my-6">
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${index === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <div className={`relative h-full w-full bg-gradient-to-r ${slide.bgColor} p-3 sm:p-4 md:p-6 flex flex-col md:flex-row items-center`}>
            <div className="relative z-10 flex-1 text-center md:text-left mb-3 md:mb-0">
              <h2 className="text-white text-base sm:text-lg md:text-xl font-bold">{slide.title}</h2>
              <h3 className="text-white text-xs sm:text-sm md:text-lg font-medium mt-1">{slide.subtitle}</h3>
              
              <button className="mt-3 sm:mt-4 bg-white text-gray-900 px-2 py-1 sm:px-3 md:px-4 md:py-2 rounded text-xs md:text-sm font-medium hover:bg-gray-100 transition-colors">
                {slide.ctaText}
              </button>
            </div>
            
            <div className="relative w-full md:w-auto h-24 sm:h-32 md:h-full aspect-square">
              <Image 
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      ))}
      
      {/* Dots navigation */}
      <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${index === activeSlide ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureSlider;