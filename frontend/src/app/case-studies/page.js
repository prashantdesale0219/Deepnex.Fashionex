'use client';
import React from 'react';
import './case-studies.css';
import CaseStudyBanner from '@/components/resources/case-studies/CaseStudyBanner';
import CaseStudyGrid from '@/components/resources/case-studies/CaseStudyGrid';
import PhotoUpgradeSection from '@/components/resources/blog/PhotoUpgradeSection';

export default function CaseStudies() {
  return (
    <main className="min-h-screen">
      <CaseStudyBanner />
      <CaseStudyGrid />
      <PhotoUpgradeSection />
      
    </main>
  );
}