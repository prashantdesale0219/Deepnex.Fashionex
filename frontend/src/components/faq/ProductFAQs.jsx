'use client';
import React, { useState } from 'react';
import { productFAQs } from '@/data/faqData';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ProductFAQs = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 pb-2 ">Product FAQs</h2>
      <div className="space-y-4">
        {productFAQs.map((faq) => (
          <div key={faq.id} className=" rounded-md mb-4 overflow-hidden bg-white shadow-sm">
            <button
              className={`flex justify-between items-center w-full text-left py-4 px-5 focus:outline-none ${openFAQ === faq.id ? 'bg-gray-50' : 'bg-white'}`}
              onClick={() => toggleFAQ(faq.id)}
            >
              <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
              {openFAQ === faq.id ? (
                <FiChevronUp className="h-5 w-5 text-gray-600 flex-shrink-0" />
              ) : (
                <FiChevronDown className="h-5 w-5 text-gray-600 flex-shrink-0" />
              )}
            </button>
            {openFAQ === faq.id && (
              <div className="px-5 py-4 bg-white ">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFAQs;