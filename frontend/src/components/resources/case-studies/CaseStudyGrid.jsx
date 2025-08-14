'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CaseStudyGrid = () => {
  // Case studies data
  const caseStudies = [
    {
      id: 1,
      title: 'Botika turned Get Dressed Collective into a boutique powerhouse',
      image: '/assets/images/slider3.webp',
      link: '/case-studies/get-dressed-collective'
    },
    {
      id: 2,
      title: 'Need lots of images fast? BLVCK turns to Botika for the win',
      image: '/assets/images/slider4.webp',
      link: '/case-studies/blvck'
    },
    {
      id: 3,
      title: 'Jordache embraces AI: Cutting costs & boosting visuals with Botika',
      image: '/assets/images/slider5.webp',
      link: '/case-studies/jordache'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14 lg:pb-20">
      {/* Main featured case study */}
      <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-md sm:shadow-xl mb-8 sm:mb-12 lg:mb-16">
        <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
          <Image 
            src="/assets/images/case-study-banner.webp" 
            alt="JUAN & ME Case Study" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/0 w-full h-full"></div>
          
          {/* Case study content */}
          <div className="absolute top-0 left-0 p-4 sm:p-8 md:p-12 lg:p-16 max-w-full sm:max-w-xl md:max-w-2xl">
            <div className="text-white text-xs sm:text-sm mb-2 sm:mb-4">Case study</div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 sm:mb-4 leading-tight">
              JUAN & ME scales content with Botika's AI—and sees 128% more conversions
            </h2>
            
            <Link 
              href="/case-studies/juan-and-me" 
              className="inline-block mt-3 sm:mt-6 px-4 sm:px-6 py-1.5 sm:py-2 bg-white text-black text-sm sm:text-base rounded-full hover:bg-gray-200 transition-colors"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>
      
      {/* Case studies grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {caseStudies.map((study) => (
          <CaseStudyCard key={study.id} study={study} />
        ))}
      </div>
    </div>
  );
};

const CaseStudyCard = ({ study }) => {
  return (
    <div className="case-study-card bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative h-[180px] sm:h-[200px] md:h-[220px] lg:h-[250px]">
        <Image 
          src={study.image} 
          alt={study.title} 
          fill 
          className="object-cover"
        />
      </div>
      
      <div className="p-3 sm:p-4">
        <div className="text-xs text-gray-600 mb-1 sm:mb-2">Case study</div>
        <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 leading-tight line-clamp-2">{study.title}</h3>
        
        <Link 
          href={study.link} 
          className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 border border-black text-black text-xs sm:text-sm rounded-full hover:bg-black hover:text-white transition-colors"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default CaseStudyGrid;