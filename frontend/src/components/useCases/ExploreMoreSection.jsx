'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ExploreMoreSection = () => {
  const cards = [
    {
      id: 1,
      image: '/assets/images/fashionX1.avif',
      title: 'Refresh your catalog',
      link: '#',
    },
    {
      id: 2,
      image: '/assets/images/fashionX2.avif',
      title: 'Minimize licensing fees',
      link: '#',
    },
    {
      id: 3,
      image: '/assets/images/fashionX3.avif',
      title: 'Ready to post social images',
      link: '#',
    },
    {
      id: 4,
      image: '/assets/images/fashionX4.avif',
      title: 'Maintain brand consistency',
      link: '#',
    },
  ];

  return (
    <section className="w-full py-10 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Explore more ways</h2>
          <p className="text-xl sm:text-2xl font-medium text-gray-700 mt-1 sm:mt-2">to use Botika</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card) => (
            <div key={card.id} className="flex flex-col">
              <div className="relative h-48 sm:h-56 md:h-64 w-full mb-3 sm:mb-4 overflow-hidden rounded-lg">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 text-center">{card.title}</h3>
              <div className="text-center mt-1 sm:mt-2">
                <Link 
                  href={card.link} 
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:underline"
                >
                  Read more
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreMoreSection;