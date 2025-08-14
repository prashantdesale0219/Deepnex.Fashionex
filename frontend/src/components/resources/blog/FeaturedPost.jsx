'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import BlogTabs from './BlogTabs';
import BlogPagination from './BlogPagination';
import PhotoUpgradeSection from './PhotoUpgradeSection';

const FeaturedPost = () => {
  // Expanded blog posts data
  const blogPosts = [
    {
      id: 1,
      title: 'Should we be labeling AI generated content in fashion?',
      excerpt: 'Labeling AI generated content sounds simple, until you ask what "real" even means...',
      author: 'Avi Friedman',
      date: 'July 29, 2025',
      image: '/assets/images/blog-banner.webp',
      category: 'Generative AI'
    },
    {
      id: 2,
      title: 'Get started with Botika: How to create stunning fashion visuals (with AI?)',
      excerpt: 'Learn how to use Botika to turn flat lays, mannequin shots, or on-model photos into professional fashion visuals',
      author: 'Avi Friedman',
      date: 'July 22, 2025',
      image: '/assets/images/ai1.webp',
      category: 'Guides'
    },
    {
      id: 3,
      title: 'How we create our AI fashion models (Hint: no real people, no prompts)',
      excerpt: 'Discover how Botika\'s 100% AI-generated fashion models offer ethical, high-quality alternatives to traditional photography',
      author: 'Erin Dagan',
      date: 'July 15, 2025',
      image: '/assets/images/slider3.webp',
      category: 'Generative AI'
    },
    {
      id: 4,
      title: 'Fashion Product Photography That Moves Product',
      excerpt: 'Learn expert tips and techniques to master fashion product photography and create compelling visuals',
      author: 'Avi Friedman',
      date: 'July 8, 2025',
      image: '/assets/images/blog-banner.webp',
      category: 'Photography'
    },
    {
      id: 5,
      title: 'Hot Looks, Cool Cuts: Summer Fashion Styles 2025',
      excerpt: 'Summer fashion styles 2025 are here. Explore top trends and how brands use AI to create eye-catching visuals',
      author: 'Avi Friedman',
      date: 'June 20, 2025',
      image: '/assets/images/ai1.webp',
      category: 'Photography'
    },
    {
      id: 6,
      title: 'Influencer marketing for small business: A no-fluff guide for fashion brands',
      excerpt: 'Boost sales with influencer marketing for small business. Learn simple, effective strategies for fashion brands',
      author: 'Avi Friedman',
      date: 'June 12, 2025',
      image: '/assets/images/slider3.webp',
      category: 'Marketing Tips'
    },
    {
      id: 7,
      title: 'Why fashion brands are betting on generative AI in eCommerce',
      excerpt: 'Generative AI in eCommerce is reshaping fashion—think faster launches, fewer returns, and better customer experiences',
      author: 'Avi Friedman',
      date: 'June 4, 2025',
      image: '/assets/images/blog-banner.webp',
      category: 'eCommerce'
    },
    {
      id: 8,
      title: 'Brand Voice Examples to Help Your Fashion Brand Talk the Talk',
      excerpt: 'Explore brand voice examples from top fashion labels and learn how to define your unique tone',
      author: 'Avi Friedman',
      date: 'May 28, 2025',
      image: '/assets/images/ai1.webp',
      category: 'Marketing Tips'
    },
    {
      id: 9,
      title: 'Fashion Moves Fast—AI Fashion Trend Forecasting Moves Faster',
      excerpt: 'Discover how AI fashion trend forecasting is changing the game for brands—helping you stay ahead of competitors',
      author: 'Avi Friedman',
      date: 'May 21, 2025',
      image: '/assets/images/slider3.webp',
      category: 'eCommerce'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Tabs */}
      <BlogTabs />
      
      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8 lg:mt-10">
        {blogPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
      
      {/* Pagination */}
      <BlogPagination />
      
      {/* Upgrade Photos Section */}
      <PhotoUpgradeSection />
    </div>
  );
};

const BlogCard = ({ post }) => {
  return (
    <div className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 rounded-lg">
      <div className="relative h-48 sm:h-56 md:h-64">
        <Image 
          src={post.image} 
          alt={post.title} 
          fill 
          className="object-cover"
        />
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {post.category}
        </div>
      </div>
      
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 hover:text-gray-600 transition-colors line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{post.excerpt}</p>
        
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            By {post.author} | {post.date}
          </div>
          
          <Link href={`/blog/${post.id}`} className="flex items-center text-xs sm:text-sm text-black hover:text-gray-600 transition-colors">
            Read More <FiArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedPost;