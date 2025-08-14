'use client';
import { useState } from 'react';
import { faqData } from '@/data/home';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0); // First FAQ is open by default

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-10 sm:py-12 md:py-16 lg:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-16 max-w-[900px]">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 md:mb-12 text-center tracking-tight">
            Frequently asked <span className="italic font-serif">questions</span>
          </h2>

          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {faqData.map((faq, index) => (
              <div 
                key={faq.id} 
                className="border-b border-gray-200 pb-2 sm:pb-3 md:pb-4"
              >
                <button
                  className="flex justify-between items-center w-full py-2 sm:py-3 md:py-4 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-medium text-gray-900 pr-2">{faq.question}</h3>
                  <span className="ml-2 sm:ml-4 md:ml-6 flex-shrink-0">
                    {openIndex === index ? (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                      </svg>
                    )}
                  </span>
                </button>
                <div
                  className={`mt-1 sm:mt-2 transition-all duration-300 overflow-hidden ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 pb-2 sm:pb-3 md:pb-4">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;