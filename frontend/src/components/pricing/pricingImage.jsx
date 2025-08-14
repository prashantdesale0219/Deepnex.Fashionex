'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const PricingImage = () => {
  return (
    <div className="w-full relative overflow-hidden my-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-auto"
      >
        <Image
          src="/assets/images/pricingBanner.avif"
          alt="Fashion Pricing Banner"
          width={1920}
          height={1080}
          className="w-full h-auto object-cover"
          priority
        />
      </motion.div>
    </div>
  );
};

export default PricingImage;