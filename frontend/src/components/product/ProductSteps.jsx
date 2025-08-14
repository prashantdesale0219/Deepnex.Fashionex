'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const ProductSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  const containerRef = useRef(null);
  const stepsRef = useRef([]);

  // Steps data
  const steps = [
    {
      number: 1,
      title: 'Upload Your Photos',
      description: 'Choose the photos you want to produce with Botika. You can use photos of someone wearing your products or simple product flat lays. Make sure they\'re well-lit and show off your products naturally.',
      image: '/assets/images/ai1.webp',
    },
    {
      number: 2,
      title: 'Choose Your Model',
      description: 'Next, pick the perfect model for your brand from our AI-generated portfolio. We\'ve got a wide range of models in different ethnicities, ages, sizes, and styles. For flat lays, choose up to four poses for your on-model photos.',
      image: '/assets/images/ai2.webp',
    },
    {
      number: 3,
      title: 'Select Your Background',
      description: 'Swap your original background with a studio look or any of our on-location options. You can also keep your original background, and our AI will blend it all together perfectly.',
      image: '/assets/images/ai3.webp',
    },
    {
      number: 4,
      title: 'Generate Your New Photos',
      description: 'Review your choices, click "Generate", and you\'re done - your photos will be ready in no time, and we\'ll email you when they\'re done.',
      image: '/assets/images/ai4.webp',
    },
    {
      number: 5,
      title: 'Refine Your Photos',
      description: 'Perfect your images with Botika\'s AI-powered touch-ups. Highlight the areas you\'d like us to review. Quick and simple for flawless results.',
      image: '/assets/images/ai5.webp',
    },
  ];

  // Setup scroll tracking to detect which step is in view
  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ['start start', 'end start'],
  });

  // Background colors for each step
  const backgroundColors = [
    'bg-blue-50',
    'bg-purple-50',
    'bg-green-50',
    'bg-amber-50',
    'bg-rose-50',
  ];

  // Update active step based on scroll position
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const stepsLength = steps.length;
    const stepsBreakpoints = steps.map((_, index) => index / stepsLength);
    
    const closestBreakpointIndex = stepsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - stepsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    
    setActiveStep(closestBreakpointIndex);
  });

  return (
    <motion.section 
      animate={{
        backgroundColor: backgroundColors[activeStep % backgroundColors.length],
      }}
      className="w-full py-12 sm:py-16 md:py-24 overflow-hidden transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto px-2 sm:px-4 md:px-0">
            Our platform makes it easy to create professional product photos with AI-generated models in just a few simple steps.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row h-[24rem] sm:h-[28rem] md:h-[30rem] relative">
          {/* Left side - Scrollable content */}
          <div 
            ref={containerRef}
            className="w-full lg:w-1/2 overflow-y-auto pr-4 sm:pr-6 lg:pr-8 hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="space-y-24 sm:space-y-32 md:space-y-40 pb-24 sm:pb-32 md:pb-40">
              {steps.map((step, index) => (
                <motion.div 
                  key={`step-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: activeStep === index ? 1 : 0.3,
                    x: activeStep === index ? 0 : -10,
                    scale: activeStep === index ? 1 : 0.98,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="my-12 sm:my-16 md:my-20"
                >
                  <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
                    <motion.div 
                      className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full ${activeStep === index ? 'bg-blue-600' : 'bg-gray-200'} text-white text-sm sm:text-base font-medium mr-3 sm:mr-4 transition-colors duration-300`}
                      animate={{
                        scale: activeStep === index ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 0.5,
                        times: [0, 0.5, 1],
                        ease: "easeInOut",
                      }}
                    >
                      {step.number}
                    </motion.div>
                    <motion.h3 
                      className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900"
                      animate={{
                        color: activeStep === index ? "#1e40af" : "#111827",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {step.title}
                    </motion.h3>
                  </div>
                  <motion.p 
                    className="text-xs sm:text-sm md:text-lg text-gray-700 ml-11 sm:ml-12 md:ml-14 max-w-sm"
                    animate={{
                      opacity: activeStep === index ? 1 : 0.7,
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    {step.description}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side - Sticky image container */}
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 lg:sticky lg:top-24 self-start h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
            <motion.div 
              className="relative w-full max-w-xs sm:max-w-sm md:max-w-lg aspect-[4/3] rounded-xl overflow-hidden shadow-2xl"
              animate={{
                boxShadow: `0 25px 50px -12px ${backgroundColors[activeStep].replace('bg-', 'rgba(var(--')}-500, 0.25)}`
              }}
              transition={{ duration: 0.7 }}
            >
              {steps.map((step, index) => (
                <motion.div 
                  key={`image-${index}`}
                  initial={{ opacity: 0, scale: 0.95, rotateY: -5 }}
                  animate={{ 
                    opacity: activeStep === index ? 1 : 0,
                    scale: activeStep === index ? 1 : 0.95,
                    rotateY: activeStep === index ? 0 : -5,
                    zIndex: activeStep === index ? 10 : 1,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image 
                    src={step.image} 
                    alt={`Step ${step.number}: ${step.title}`} 
                    fill 
                    className="object-cover"
                    priority={index === 0}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </motion.section>
  );
};

export default ProductSteps;