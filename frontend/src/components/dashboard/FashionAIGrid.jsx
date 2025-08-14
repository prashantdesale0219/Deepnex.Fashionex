import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FashionAIGrid = () => {
  const fashionTools = [
    {
      id: 1,
      title: 'Fashion Reels',
      image: '/assets/images/banner1.webp',
      link: '/try-now',
      bgColor: 'bg-purple-50'
    },
    {
      id: 2,
      title: 'Product AnyShoot',
      image: '/assets/images/banner2.webp',
      link: '/try-now',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      title: 'Virtual Try On',
      image: '/assets/images/banner3.webp',
      link: '/try-now',
      bgColor: 'bg-pink-50'
    },
    {
      id: 4,
      title: 'Virtual Try On Shoes',
      image: '/assets/images/banner4.webp',
      link: '/try-now',
      bgColor: 'bg-amber-50'
    },
    {
      id: 5,
      title: 'AI Background for Models',
      image: '/assets/images/blog-banner.webp',
      link: '/try-now',
      bgColor: 'bg-green-50',
      isNew: true
    },
    {
      id: 6,
      title: 'AI Model Swap',
      image: '/assets/images/case-study-banner.webp',
      link: '/try-now',
      bgColor: 'bg-indigo-50'
    }
  ];

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Fashion AI</h2>
        <Link 
          href="/all-tools" 
          className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center"
        >
          View All
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {fashionTools.map((tool) => (
          <Link key={tool.id} href={tool.link} className="block group">
            <div className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${tool.bgColor}`}>
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={tool.image}
                  alt={tool.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {tool.isNew && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-red-500 text-white text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    NEW
                  </div>
                )}
              </div>
              <div className="p-2 sm:p-3 md:p-4">
                <h3 className="font-medium text-sm sm:text-base text-gray-900">{tool.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FashionAIGrid;