'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCheck, FiX } from 'react-icons/fi';

const BlogContent = () => {
  // Sample blog post data
  const blogPosts = [
    {
      id: 1,
      title: 'How to increase ROAS for fashion eCommerce using better photos',
      excerpt: 'Discover new ways to elevate your brand with tips and trends from the fashion world',
      author: 'Avi Friedman',
      date: 'August 5, 2025',
      image: '/assets/images/blog-banner.webp',
      category: 'eCommerce'
    },
    {
      id: 2,
      title: 'The future of AI in fashion photography',
      excerpt: 'Learn how artificial intelligence is transforming product photography in the fashion industry',
      author: 'Sarah Johnson',
      date: 'July 28, 2025',
      image: '/assets/images/ai1.webp',
      category: 'Technology'
    },
    {
      id: 3,
      title: 'Sustainable fashion photography practices',
      excerpt: 'Explore eco-friendly approaches to fashion photography that reduce environmental impact',
      author: 'Michael Chen',
      date: 'July 15, 2025',
      image: '/assets/images/slider3.webp',
      category: 'Sustainability'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      
      {/* Get 40% OFF Section */}
      <div className="mt-10 sm:mt-16 md:mt-20 mb-6 sm:mb-8 md:mb-10 bg-gray-100 p-4 sm:p-6 md:p-8 rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 items-center">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 md:mb-4">Get 40% OFF + FREE SHIPPING</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-5 md:mb-6">Limited time offer for all fashion eCommerce products</p>
            <button className="bg-black text-white text-sm sm:text-base px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-md hover:bg-gray-800 transition-colors">Shop Now</button>
          </div>
          
          <div className="relative h-[200px] sm:h-[250px] md:h-[300px]">
            <Image 
              src="/assets/images/blog-banner.webp" 
              alt="Fashion eCommerce Offer" 
              fill 
              className="object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 sm:h-56 md:h-64">
        <Image 
          src={post.image} 
          alt={post.title} 
          fill 
          className="object-cover"
        />
        <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {post.category}
        </div>
      </div>
      
      <div className="p-4 sm:p-5 md:p-6">
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-1.5 md:mb-2">{post.title}</h3>
        <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 md:mb-4">{post.excerpt}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-xs sm:text-sm text-gray-500">
            By {post.author} | {post.date}
          </div>
          
          <Link href={`/blog/${post.id}`} className="flex items-center text-xs sm:text-sm text-blue-600 hover:text-blue-800">
            Read More <FiArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogContent;