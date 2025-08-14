'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { pricingData } from '../../data/pricing';
import PricingCard from './pricingCard';
import { motion } from 'framer-motion';

const PricingContent = () => {
  const [photoCount, setPhotoCount] = useState(pricingData.slider.default);
  const [billingType, setBillingType] = useState(
    pricingData.billingOptions.find(option => option.isDefault)?.id || 'monthly'
  );
  
  // Calculate price multiplier based on photo count
  const priceMultiplier = useMemo(() => {
    const baseCount = pricingData.slider.default;
    return photoCount / baseCount;
  }, [photoCount]);

  const handleSliderChange = (e) => {
    setPhotoCount(parseInt(e.target.value));
  };

  const handleBillingTypeChange = (type) => {
    setBillingType(type);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl"><br /><br />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Take <span className="italic">your</span> fashion photos
          <br />
          to the next level
        </h1>
        <p className="text-lg mb-8">I need {photoCount} photos per month</p>
        
        {/* Slider */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>{pricingData.slider.min}</span>
            <span>{pricingData.slider.max}+</span>
          </div>
          <input
            type="range"
            min={pricingData.slider.min}
            max={pricingData.slider.max}
            value={photoCount}
            onChange={handleSliderChange}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          />
          <div className="mt-2 text-center">
            <span className="inline-block px-4 py-1 bg-[var(--vanilla)] text-[var(--coffee)] rounded-full">
              {photoCount}
            </span>
          </div>
        </div>
        
        {/* Billing Type Toggle */}
        <div className="inline-flex bg-gray-100 rounded-full p-1 mb-12">
          {pricingData.billingOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleBillingTypeChange(option.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${billingType === option.id ? 'bg-[var(--coffee)] text-white' : 'text-gray-700'}`}
            >
              {option.label}
              {option.discount && billingType !== option.id && (
                <span className="ml-2 text-xs bg-[var(--almond)] text-white px-2 py-0.5 rounded-full">
                  {option.discount}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-0">
        {pricingData.plans.map((plan, index) => {
          // Calculate adjusted price and credits based on slider value
          const adjustedPlan = {
            ...plan,
            price: Math.round(plan.price * priceMultiplier),
            credits: Math.round(plan.credits * priceMultiplier)
          };
          
          // Apply annual discount if applicable
          if (billingType === 'annual') {
            adjustedPlan.price = Math.round(adjustedPlan.price * 0.83); // 17% discount
          }
          
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <PricingCard 
                plan={adjustedPlan} 
                billingType={billingType === 'monthly' ? 'monthly' : 'annually'} 
              />
            </motion.div>
          );
        })}
      </div>

     
    </div>
  );
};

export default PricingContent;