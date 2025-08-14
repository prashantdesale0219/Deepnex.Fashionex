'use client';
import React from 'react';
import './blog.css';
import BlogBanner from '@/components/resources/blog/BlogBanner';
import FeaturedPost from '@/components/resources/blog/FeaturedPost';

export default function Blog() {
  return (
    <main className="min-h-screen">
      <BlogBanner />
      <FeaturedPost />
    </main>
  );
}