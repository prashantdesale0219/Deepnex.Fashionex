'use client';
import React from 'react';
import Link from 'next/link';

const BlogTabs = () => {
  const tabs = [
    { name: 'All', href: '/blog' },
    { name: 'Guides', href: '/blog?category=guides' },
    { name: 'eCommerce', href: '/blog?category=ecommerce' },
    { name: 'News', href: '/blog?category=news' },
    { name: 'Marketing Tips', href: '/blog?category=marketing-tips' },
    { name: 'Photography', href: '/blog?category=photography' },
    { name: 'Generative AI', href: '/blog?category=generative-ai' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6">
      <div className="flex justify-start sm:justify-center space-x-2 sm:space-x-3 md:space-x-4 overflow-x-auto pb-1 sm:pb-2">
        {tabs.map((tab) => (
          <Link 
            key={tab.name} 
            href={tab.href}
            className="px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-md transition-colors whitespace-nowrap"
          >
            {tab.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogTabs;