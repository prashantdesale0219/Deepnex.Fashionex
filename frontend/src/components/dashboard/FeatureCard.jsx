import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FeatureCard = ({ title, description, icon, link, bgColor }) => {
  return (
    <div className={`rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${bgColor || 'bg-white'}`}>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 relative mr-4">
            <Image 
              src={icon} 
              alt={title} 
              width={48} 
              height={48}
              className="object-contain"
            />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{description}</p>
        
        <Link 
          href={link} 
          className="inline-flex items-center text-gray-900 font-medium hover:text-gray-700 transition-colors"
        >
          Try Now
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default FeatureCard;