import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const FashionReels = () => {
  const fashionReels = [
    {
      id: 1,
      title: 'Fashion Reels',
      description: 'AI-fit Remove Scout with Fashion Reels in 1080p',
      image: '/assets/images/fashion-reel-1.jpg',
      link: '/tool/fashion-reels',
      bgColor: 'bg-gray-50'
    },
    {
      id: 2,
      title: 'Fashion Reels',
      description: 'AI-fit Remove Scout with Fashion Reels in 1080p',
      image: '/assets/images/fashion-reel-2.jpg',
      link: '/tool/fashion-reels',
      bgColor: 'bg-gray-50'
    },
    {
      id: 3,
      title: 'Fashion Reels',
      description: 'AI-fit Remove Scout with Fashion Reels in 1080p',
      image: '/assets/images/fashion-reel-3.jpg',
      link: '/tool/fashion-reels',
      bgColor: 'bg-gray-50'
    },
    {
      id: 4,
      title: 'Fashion Reels',
      description: 'AI-fit Remove Scout with Fashion Reels in 1080p',
      image: '/assets/images/fashion-reel-4.jpg',
      link: '/tool/fashion-reels',
      bgColor: 'bg-gray-50'
    },
    {
      id: 5,
      title: 'Fashion Reels',
      description: 'AI-fit Remove Scout with Fashion Reels in 1080p',
      image: '/assets/images/fashion-reel-5.jpg',
      link: '/tool/fashion-reels',
      bgColor: 'bg-gray-50'
    }
  ];

  return (
    <div className="mt-6 sm:mt-8">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Fashion Reels</h2>
        <Link 
          href="/all-reels" 
          className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center"
        >
          View All
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {fashionReels.map((reel) => (
          <Link key={reel.id} href={reel.link} className="block group">
            <div className={`rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all ${reel.bgColor}`}>
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={reel.image}
                  alt={reel.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-4 h-4 sm:w-6 sm:h-6">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-2 sm:p-3">
                <h3 className="font-medium text-xs sm:text-sm text-gray-900">{reel.title}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">{reel.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FashionReels;