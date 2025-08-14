import React from 'react';
import PricingContent from '../../components/pricing/pricingContent';
import PricingImage from '../../components/pricing/pricingImage';
import './pricing.css';
import AISolutions from '@/components/home/aiSolutions';
import ContactSales from '../../components/pricing/contactSales';
import FAQ from '@/components/home/faq';

export const metadata = {
  title: 'Pricing - FashionX',
  description: 'Choose the perfect plan for your fashion photography needs',
};

const PricingPage = () => {
  return (
    <main className="min-h-screen bg-white">
     
      <PricingContent />
       <PricingImage />
      <AISolutions/>  
      <ContactSales />
      <FAQ/>
    </main>
  );
};

export default PricingPage;